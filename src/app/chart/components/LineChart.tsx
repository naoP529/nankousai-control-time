// components/LineChart.tsx
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { UUID } from 'crypto';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

type ClassWaitTime = {
  time: number;
  className: string;
};

type TimeSlotData = {
  time: string; // 例: "9:00"
  data: ClassWaitTime[];
};

type DateData = {
  id:UUID;
  date:string;
  times:TimeSlotData[];
}
type OutputTime = {
  className: string;
  timeData: number[];
};
type Output = {
  labels:string[];
  data:OutputTime[];
}
type Dataset ={
  label:string
  data: number[]
  borderColor: string
  backgroundColor: string
  tension: number
}
export default function LineChart() {
        const predata:ChartData<"line"> = {
        labels: ['9:00'],
        datasets: [
          {
            label: 'センサー値1',
            data: [0],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            tension: 0.2, // ← アニメーションなし
          },
          {
            label: 'センサー値2',
            data: [0],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            tension: 0, // ← アニメーションなし
          },
        ],
      };
        const options:ChartOptions<'line'> = {
          plugins: {
            legend: {
              position: "bottom", 
              labels: {
                padding: 20, // ラベル間の余白
                textAlign: "center", // "start", "end" も可
              }
            }
          },

          responsive: true,
            animation: {
            duration: 800, // ミリ秒で指定
            easing: 'easeOutQuart', // 動きの曲線
          },
          scales: {
            x: {
              title: { display: true, text: '時刻' },
            },
            y: {
              title: { display: true, text: '待ち時間' },
              min: 180,
              max: 0,
            },
          },
          };
    const LABELCOLORS =["#118AB2","#EF476F","#FFD166"];//青　赤　気
    const BGCOLORS =["rgba(17,138,178,1)","rgba(239,71,111,1)","rgba(255,209,102,1)"]
    const [showData,setShowData] =  useState<ChartData<"line">>(predata);
    const [targetDate,setTargetDate] = useState<string>();
    const [dates,setDates] = useState<DateData[]>([]);
    const [renewTime,setRenewTime] = useState<string>();
    const [nextRenewTime,setNextRenewTime] = useState<string>();
    const [running,setRunning] = useState<boolean>(false);
    const intervalRef = useRef<number | null>(null);
    //
    const [open,setOpen] = useState(false);
    useEffect(()=>{
      const now = new Date();
      const date = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
      setTargetDate(date);
      const getDates =async ()=>{
        const {data,error} = await supabase.from("CHARTDATA").select("*");
        if(data){
          setDates(data)
        }
      }
      getDates();
    },[])
    const fetchData = async ()=>{
        const now = new Date();
        const date = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
        const Minutes = Math.floor(now.getMinutes() / 10) * 10;
        const time = `${now.getHours().toString().padStart(2, '0')}:${Minutes.toString().padStart(2, '0')}`;
        const {data:rowData} = await supabase.from("contents").select("className,waitTime");
        const {data:chartData} = await supabase.from("CHARTDATA").select("*");
        if(!chartData){
            return console.log("error");
        }
        if(!rowData){
          return console.log("error");
        }
        console.log(chartData);
        const toadyData = chartData.find(data=>data.date == date) as DateData;
        const formatedTimeMap = rowData.map((data)=>{
          const item = {
            className:data.className,
            time:data.waitTime
          }
          return item;
        })
        console.log(toadyData);
        if(toadyData){
            //データを追加
            //database用のデータ追加
            const targetdata = {time:`${time}`,data:formatedTimeMap};
            console.log(date);
            const copy = toadyData;
            if(toadyData.times.find(item => item.time == time)){
              //重複
              return console.log("重複")
            }
            copy.times.push(targetdata);
            
            const {data:newData,error:insertError} = await supabase.from("CHARTDATA").update(copy).eq("id",toadyData.id).select();
            console.log(newData,insertError);
        }else{
          //dateがないので
            const targetdata = {date:date,times:[{time:`${time}`,data:formatedTimeMap}]}
            const {data:insertedData} = await supabase.from("CHARTDATA").insert(targetdata).select();
            console.log(insertedData)
        }
        
        

    }
    //対象の日付のみ取得し、showDataを更新する。
    const getData = async (target:string)=>{
      console.log("heloo")
      const {data,error} = await supabase.from("CHARTDATA").select("*").eq("date",target) 
      if(!data?.[0]){
        return console.log(error)
      }
      const targetData = data[0] as DateData;
      console.log(targetData);
      function processTimeData(input: TimeSlotData[]): Output {
        const sorted = input.slice().sort((a, b) => {
          const timeA = new Date(`1970-01-01T${a.time}:00`).getTime();
          const timeB = new Date(`1970-01-01T${b.time}:00`).getTime();
                return timeA - timeB;
              });
        const labels = sorted.map(item=>item.time);
        const classMap = new Map<string, number[]>();
      
        for (const block of sorted) {
          for (const entry of block.data) {
            if (!classMap.has(entry.className)) {
              classMap.set(entry.className, []);
            }
            classMap.get(entry.className)!.push(entry.time);
          }
        }
        const data: OutputTime[] = Array.from(classMap.entries()).map(
          ([className, timeData]) => ({
            className,
            timeData,
          })
        );
      
        return {labels,data};
      }
      const processedData = processTimeData(targetData.times) as Output;

      const datasets:Dataset[] = processedData.data.map((item)=>{
        const colors = setColor(item.className);
        return {
          label:item.className,
          data:item.timeData,
          borderColor:colors.borderColor,
          backgroundColor: colors.backgroundColor,
          tension: 0,
        }
      });
      const chartData:ChartData<"line"> = {
        labels:processedData.labels,
        datasets:datasets
      }
      setShowData(chartData);
    }
    const setColor = (className:string) =>{
      const year = Number(targetDate?.split("/")[0]);
      const mod = year % 3 ;
      const colors = {
        firstGrade:{borderColor:LABELCOLORS[mod],backgroundColor:BGCOLORS[mod]},
        secondGrade:{borderColor:LABELCOLORS[(mod+2)%3],backgroundColor:BGCOLORS[(mod+2)%3]},
        thirdGrade:{borderColor:LABELCOLORS[(mod+1)%3],backgroundColor:BGCOLORS[(mod+1)%3]},
    }
      if(className.includes("中学1年")){
        return colors.firstGrade
      }
      if(className.includes("中学2年")){
        return colors.secondGrade
      }
      if(className.includes("中学3年")){
        return colors.thirdGrade
      }
      return { borderColor: "#6B7280", backgroundColor: "rgba(107,114,128,0.2)" }
    }

    const update = async (target:string)=>{
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setRenewTime(time);
      const next = new Date(now.getTime() + 10 * 60 * 1000)
      const nextTime = `${next.getHours().toString().padStart(2, '0')}:${next.getMinutes().toString().padStart(2, '0')}`;
      setNextRenewTime(nextTime);
      await fetchData();
      await getData(target);
    }
    const handleStart = () => {
      const now = new Date();
      const date = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
      setTargetDate(date);
      update(date);
      intervalRef.current = window.setInterval(() => {
        update(date);
      }, 600000);
    };
    const handleStop = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setNextRenewTime("ストップ中")
    };
    const handleDateDelete = async (id:UUID) =>{
      const {error} = await supabase.from("CHARTDATA").delete().eq("id",id);
      if(!error){
        console.log("delete完");
      }else{
        console.log(error);
      }
    }
  return <>
    <div className='flex items-center justify-center'>
        <h2 className='text-3xl'>待ち時間の推移{targetDate && targetDate}</h2>
    </div>
    <Line data={showData} options={options} />;
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "サイドバーを閉じる" : "サイドバーを開く"}
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-gray-800 text-white p-3 rounded-md shadow-lg hover:bg-gray-700 transition"
      >
        {open ? "×" : "≣"}
      </button>
      <aside
        className={`fixed inset-y-0 left-0 w-64 transform 
          bg-gradient-to-br 
            from-[#05a8bd]/80 via-[#05bd92]/80 to-[#f3e50a]/80 
          text-white shadow-md 
          transition-transform duration-300 z-40
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="flex flex-col h-full pt-18 px-6 space-y-4">
          <h2 className="text-2xl font-bold">日付を選択</h2>
          <ul className="flex-1 overflow-y-auto space-y-3 pr-2">
            {dates.map((date, i) => (
              <li key={i} className='flex justify-between items-center w-full text-left px-4 py-2 bg-white text-gray-800 rounded-md shadow hover:bg-gray-50 transition'>
                <button
                  onClick={() => {setTargetDate(date.date)
                    getData(date.date)
                  }}
                  className="border-b-1 hover:text-blue-500 transition duration-300"
                >
                  {date.date}
                </button>
                <button 
                onClick={()=>{
                  if(confirm("1本当に削除しますか？")){
                    if(confirm("2本当に削除しますか？")){
                      if(confirm("3本当に削除しますか？")){
                        if(confirm("4本当に削除しますか？")){
                          handleDateDelete(date.id);
                          window.location.reload();
                  }
                  }
                  }
                  }
                  }}
                className='text-xs text-red-500 w-6 h-6 p-1 rounded-md bg-gray-300 hover:bg-gray-400 transition duration-300'>
                 削
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="fixed bottom-0 left-0 w-full h-16 bg-gray-900 text-white flex items-center justify-between px-6 z-40 shadow-md">
        <span>© 2025 待ち時間表示システム</span>
        <button onClick={()=>{
          if(running){
            if(window.confirm("本当にやめますか？")){
              if(window.confirm(`

                
                本当の本当にやめますか？`)){
                handleStop();
                setRunning(false);
              }
            }
          }else{
            if(window.confirm("始めますか？")){
              const now = new Date();
              const date = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
              setTargetDate(date);
              handleStart();
              setRunning(true);
            }
          }
        }} className='text-black bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-300 transition'>
            {running ? "実行中":"実行する"}
        </button>
        <div className=" text-white px-4 py-2  flex gap-2">
          <div>次回の更新まで <span>{nextRenewTime ? nextRenewTime : "00:00"}</span></div>
          <div>更新時刻 <span>{renewTime ? renewTime : "00:00"}</span></div>
        </div>
      </div>

    
  </>
}