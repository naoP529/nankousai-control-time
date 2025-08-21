import { ChartOptions } from 'chart.js';
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ScrollContainer from 'react-indiana-drag-scroll';
import { supabase } from '@/lib/supabaseClient';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type classMap = {
  id:number,
  className:string,
  waitTime:number,
  prevTime:number
}
type Props = {
  classMap: classMap[];
};
type Datasets = {
    label: string,
    data: number[],
    backgroundColor: string[],
    borderColor: string[],
    borderWidth: number,
}
type barData = {
    labels: string[],
    datasets: Datasets[]
}
type SelectClass ={
    id:number,
    classNames:string,//sortのために集める
}
type Class_location ={
  floors:string,
  classes:string[]
}
type Congestion_info = {
  floor:string,
  sumTime:number,
  situation:string,
}
const PageInner = ({classMap}:Props) => {

    const predata: barData = {
      labels: ['1-1'],
      datasets: [
        {
          label: '売上高',
          data: [120],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1
        }
      ]
    };
    
    const [selectClasses,setSelectClasses] = useState<SelectClass[]>();//idを基準に集める;
    const [showData,setShowData] = useState<barData>(predata);
    const [class_location,setClass_location] = useState<Class_location[]>();
    const [congestion_info,setCongestrion_info] = useState<Congestion_info[]>()
    const options : ChartOptions<"bar"> ={
        responsive:true,
        maintainAspectRatio: false,
        plugins:{
            legend:{
                display:true,
                position:"top",
                labels:{
                    color:"#333",
                    font:{
                        size:14,
                        family:'Noto Sans JP'
                    }
                }
            },
            tooltip:{
                enabled:true,
                backgroundColor:'rgba(0,0,0,0.7)',
                titleFont:{size:14},
                padding:10
            }
        },
        scales: {
        x: {
          title: {
            display: true,
            text: 'クラス',
            color: '#000',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            color: '#444',
            font: {
              size: 12
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '待ち時間',
            color: '#666',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            color: '#444',
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(200,200,200,0.2)'
          }
        }
  }

    }
    useEffect(()=>{
      const fetch = async ()=>{
        const {data:floors,error} = await supabase.from("others").select("data").eq("DATANAME","class_locationByFloor")
        if(!floors?.[0] || error){
          return console.log(error);
        }
        const tar = floors[0].data as Class_location[];
        console.log(tar)
        setClass_location(tar)
      }
      fetch()
    },[])
    useEffect(()=>{
        if(selectClasses?.length==0 || !selectClasses) return
        const LABELCOLORS =["#118AB2","#EF476F","#FFD166"];//青　赤　気
        const BGCOLORS =["rgba(17,138,178,1)","rgba(239,71,111,1)","rgba(255,209,102,1)"]
        const sortedClasses:SelectClass[] = [...selectClasses].sort((a,b)=>{
            return a.classNames.localeCompare(b.classNames);
        })
        const newLabels:string[] = sortedClasses.map((item)=>item.classNames);
        const newData:number[] = sortedClasses.map((item)=>{
            const tar = classMap.find((c)=> c.id == item.id );
            return tar?.waitTime || 0
        })
        const setColors = (className:string) =>{
            const now = new Date();
            const year = Number(now.getFullYear());
            const mod = year % 3 ;
            const colors = {
                firstGrade:{borderColor:LABELCOLORS[mod],backgroundColor:BGCOLORS[mod]},
                secondGrade:{borderColor:LABELCOLORS[(mod+2)%3],backgroundColor:BGCOLORS[(mod+2)%3]},
                thirdGrade:{borderColor:LABELCOLORS[(mod+1)%3],backgroundColor:BGCOLORS[(mod+1)%3]},
            }
            if(className.includes("1年")){
                return colors.firstGrade
            }else if( className.includes("2年")){
                return colors.secondGrade
            }else if(className.includes("3年")){
                return colors.thirdGrade
            }else{
                return { borderColor: "#6B7280", backgroundColor: "rgba(107,114,128,0.2)" }
            }
        }
        const newBorderColors = sortedClasses.map((item)=>{
            const colors = setColors(item.classNames);
            return colors.borderColor
        })
        const newBackgroundColors = sortedClasses.map((item)=>{
            const colors = setColors(item.classNames);
            return colors.backgroundColor
        })
        const newBarData: barData = {
            labels: newLabels,
            datasets: [
                {
                    label: "待ち時間",
                    data: newData,
                    backgroundColor: newBackgroundColors,
                    borderColor: newBorderColors,
                    borderWidth: 1
                }
            ]
        }
        setShowData(newBarData)
    },[selectClasses,classMap])
    useEffect(()=>{
      if(!class_location) return ;
      const indecation =(num:number)=>{
        if(num < 100){
          return "すいている"
        }else if(num<200){
          return "やや混雑"
        }else if(num<300){
          return "混雑"
        }else if(num<400){
          return "渋滞"
        }else{
          return "激しい渋滞"
        }
      }
      const floorClasses: Congestion_info[] = class_location
        .map((item) => {
          const tar = item.classes;
          
          let sum = 0;
          for (const className of tar) {
            const targetClass = classMap.find((item) => item.className == className);
            if (!targetClass) return undefined;
            const time = targetClass.waitTime;
            sum += time;
          }
          
          return {
            floor: item.floors,
            sumTime: sum,
            situation: indecation(sum)
          };
        })
        .filter((item): item is Congestion_info => item !== undefined);
      setCongestrion_info(floorClasses);
      console.log(floorClasses);
    },[classMap,class_location])
    const filerClassesByFloor = (targetFloor:string)=>{
     
      if(!class_location?.[0]) return
      const floorClasses = class_location.find((item)=>item.floors == targetFloor);
      console.log(floorClasses);
      if(!floorClasses) return
      const filterd = floorClasses.classes
      .map((className)=>{
        const match = classMap.find(c=>c.className == className)
        return match ? {id:match.id,classNames:match.className} : undefined
      })
      .filter((item): item is SelectClass => item !== undefined)
      setSelectClasses(filterd);
      console.log(filterd);
      
    }
     const  filerClassesByName= (targetName:string)=>{
      const targetClasses = classMap.filter((item)=>item.className.includes(targetName) == true) ;
      const fData:SelectClass[] = targetClasses.map((item)=>{
        return {
          id:item.id,
          classNames:item.className
        }
      })
      setSelectClasses(fData)
      console.log(targetClasses);

    }
    const filterClassesAll = ()=>{
      const targetClasses:SelectClass[] = classMap.map((item)=>{
        return{
          id:item.id,
          classNames:item.className
        }
      })
      setSelectClasses(targetClasses);
    }
    const setScrollColor = (className:string)=>{
      const COLORS =["from-sky-400 via-blue-400 to-indigo-400","from-pink-300 via-rose-400 to-red-400","from-yellow-300 to-amber-400"]//青　赤　黄
      const now = new Date();
      const year =Number(now.getFullYear());
      const mod = year % 3;
      const colors = {
                firstGrade:COLORS[mod],
                secondGrade:COLORS[(mod+2)%3],
                thirdGrade:COLORS[(mod+1)%3]
            }
      if(className.includes("1年")){
        return colors.firstGrade;
      }else if(className.includes("2年")){
        return colors.secondGrade;
      }else if(className.includes("3年")){
        return colors.thirdGrade;
      }else {
        return "from-gray-300 to-gray-400"
      }
    }
    const SCROLL_TAGS = [
      {title:"全て",method:()=>{filterClassesAll()},color:"from-pink-300 via-yellow-300 via-green-300 to-blue-300"},
      {title:"高校生",method:()=>{filerClassesByName("高校")},color:"from-indigo-700 via-blue-800 to-slate-800"},
      {title:"中学生",method:()=>{filerClassesByName("中学")},color:"from-teal-300 via-emerald-400 to-green-400"},
      {title:"高校1年生",method:()=>{filerClassesByName("高校1年")},color:setScrollColor("1年")},
      {title:"高校2年生",method:()=>{filerClassesByName("高校2年")},color:setScrollColor("2年")},
      {title:"高校3年生",method:()=>{filerClassesByName("高校3年")},color:setScrollColor("3年")},
      {title:"クスノキ広場",method:()=>{filerClassesByFloor("クスノキ広場")},color:"from-blue-100 via-sky-200 to-cyan-100"},
      {title:"1F",method:()=>{filerClassesByFloor("1F")},color:"from-green-300 via-emerald-400 to-teal-400"},
      {title:"2F",method:()=>{filerClassesByFloor("2F")},color:"from-purple-300 via-violet-400 to-indigo-400"},
      {title:"3F",method:()=>{filerClassesByFloor("3F")},color:"from-orange-300 via-amber-400 to-yellow-400"},
      {title:"4F",method:()=>{filerClassesByFloor("4F")},color:"from-cyan-300 via-sky-400 to-blue-300"},
      {title:"5F",method:()=>{filerClassesByFloor("5F")},color:"from-gray-300 via-slate-400 to-zinc-400"},
      {title:"6F",method:()=>{filerClassesByFloor("6F")},color:"from-yellow-700 via-amber-600 to-orange-500"},
      {title:"中学1年生",method:()=>{filerClassesByName("中学1年")},color:setScrollColor("1年")},
      {title:"中学2年生",method:()=>{filerClassesByName("中学2年")},color:setScrollColor("2年")},
      {title:"中学3年生",method:()=>{filerClassesByName("中学3年")},color:setScrollColor("3年")},
    ]
  return (
    <>
    <div className="flex flex-col md:flex-row w-full">
    <div className="w-full lg:w-[80%] ml-0  bg-white rounded shadow min-h-[calc(100vh-160px)]">
      <Bar data={showData} options={options} />
    </div>
    <div className="w-full lg:w-[20%] px-4 py-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">各場所の状況</h2>

      {congestion_info?.map((value, i) => (
        <div key={i} className="flex justify-between text-2xl bg-white rounded shadow p-4 border-l-4 border-blue-300">
          <div className=" font-medium text-gray-600 mb-1">
            {value.floor}
          </div>
          <div className={` font-semibold ${
            value.situation === "空いている" ? "text-green-500" :
            value.situation === "やや混雑" ? "text-yellow-500" :
            value.situation === "混雑" ? "text-orange-500" :
            value.situation === "渋滞" ? "text-red-500" :
            value.situation === "激しい渋滞" ? "text-red-700" : "text-gray-500"
          } mx-auto`
           
          }>
            {value.situation}
          </div>
        </div>
      ))}
    </div>
    </div>
    <div className='fixed bottom-0 left-0 w-full z-50'>
    <div className='py-2 bg-gray-100'>
        <ScrollContainer>
          <div className='flex my-3 items-center'>
              {SCROLL_TAGS.map((value,i)=>(
                <div key={i} className={`flex-shrink-0 drop-shadow-lg relative  cursor-pointer  rounded-lg mx-[2vw] lg:mx-3 bg-gradient-to-br p-[0.5%] ${value.color} h-[10vw] lg:h-12 lg:p-[2px] inline-block `} >
                  <button
                      id={value.title}
                      value={value.title} 
                      onClick={value.method}
                      className="hidden"
                  />
                  <label 
                      htmlFor={value.title}
                      className={`text-[4vw] lg:text-lg
                      font-medium cursor-pointer flex h-full relative`}
                  >
                      <div className={`z-0 bg-white absolute rounded-md h-full w-full `}></div>
                      <p className={`px-[4vw] lg:px-6 my-auto  z-[5] bg-gradient-to-br text-transparent bg-clip-text ${value.color} `}>
                                        {value.title}
                        </p>
                  </label>
                </div>
              ))}
          </div>
        </ScrollContainer>
    </div>
    <footer className="bg-gray-900 text-center py-2 text-sm text-white shadow-inner">
        © 2025 待ち時間リアルタイムグラフ
    </footer>
    </div>

    </>
  )
}

export default PageInner