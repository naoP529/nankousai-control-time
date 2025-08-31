import React, { Suspense, useEffect, useState, useCallback } from 'react';
import Card from './Card';
import { BiChevronsLeft, BiChevronsRight } from 'react-icons/bi';
import ScrollContainer from 'react-indiana-drag-scroll';

type Event = {
  className: string;
  title: string;
  place: string;
  time: string[];
  comment: string;
  backImg: string;
  frontImg: string;
  types: string[];
  waitTime: number;
  tagline: string;
  content: string;
};

type Floor = {
  floors: string;
  classes: string[];
};

type Props = {
  eventRef: React.RefObject<Event[]>;
  floorRef: React.RefObject<Floor[]>;
  index: number;
};

const ShowCards = ({ eventRef, floorRef, index }: Props) => {
  const [tarIndex, setTarIndex] = useState(0);
  const [showClasses, setShowClasses] = useState<number[]>([]);

  const events = eventRef.current ?? [];
  const len = events.length;

  // 初期化
  useEffect(() => {
    if (!eventRef.current || eventRef.current.length === 0) return;
    const tmp = Array.from({ length: eventRef.current.length }, (_, i) => i);
    setShowClasses(tmp);
  }, [eventRef.current]);

  // tarIndex の整合性
  useEffect(() => {
    if (showClasses.length > 0 && !showClasses.includes(tarIndex)) {
      setTarIndex(showClasses[0]);
    }
  }, [showClasses]);

  // forwardIndex
  const forwardIndex = useCallback(() => {
    if (showClasses.length === 0) return;

    setTarIndex((prev) => {
      const currentPos = showClasses.indexOf(prev);
      if (currentPos === -1) return showClasses[0];
      const nextPos = (currentPos + 1) % showClasses.length;
      return showClasses[nextPos];
    });
  }, [showClasses]);

  // backIndex
  const backIndex = useCallback(() => {
    if (showClasses.length === 0) return;

    setTarIndex((prev) => {
      const currentPos = showClasses.indexOf(prev);
      if (currentPos === -1) return showClasses[0];
      const nextPos = (currentPos - 1 + showClasses.length) % showClasses.length;
      return showClasses[nextPos];
    });
  }, [showClasses]);

  // タイマー
  useEffect(() => {
    if (!showClasses.includes(tarIndex)) return;
    const timer = setTimeout(() => {
      forwardIndex();
    }, 9800);
    return () => clearTimeout(timer);
  }, [tarIndex, showClasses, forwardIndex]);

  // フィルター関数群
  const filterClassesAll = () => {
    if (!eventRef.current) return;
    const tmp = Array.from({ length: eventRef.current.length }, (_, i) => i);
    setShowClasses(tmp);
  };

  const filterCLassesByName = (tar: string) => {
    const targetClasses: number[] = [];
    eventRef.current?.forEach((value, index) => {
      if (value.className.includes(tar)) {
        targetClasses.push(index);
      }
    });
    setShowClasses(targetClasses);
  };

  const filterCLassesByFloor = (tar: string) => {
    if (!floorRef.current) return;
    const tarFloorClasses = floorRef.current.find((item) => item.floors === tar);
    if (!tarFloorClasses || !Array.isArray(tarFloorClasses.classes)) return;

    const targetClasses: number[] = [];
    eventRef.current?.forEach((value, index) => {
      if (tarFloorClasses.classes.includes(value.className)) {
        targetClasses.push(index);
      }
    });
    setShowClasses(targetClasses);
  };

  const currentCard = events[tarIndex];

  const setScrollColor = (className: string) => {
    const COLORS = [
      'from-sky-400 via-blue-400 to-indigo-400',
      'from-pink-300 via-rose-400 to-red-400',
      'from-yellow-300 to-amber-400',
    ];
    const year = new Date().getFullYear();
    const mod = year % 3;
    const colors = {
      firstGrade: COLORS[mod],
      secondGrade: COLORS[(mod + 2) % 3],
      thirdGrade: COLORS[(mod + 1) % 3],
    };
    if (className.includes('1年')) return colors.firstGrade;
    if (className.includes('2年')) return colors.secondGrade;
    if (className.includes('3年')) return colors.thirdGrade;
    return 'from-gray-300 to-gray-400';
  };

  const SCROLL_TAGS = [
    { title: '全て', method: filterClassesAll, color: 'from-pink-300 via-yellow-300 via-green-300 to-blue-300' },
    { title: '高校生', method: () => filterCLassesByName('高校'), color: 'from-indigo-700 via-blue-800 to-slate-800' },
    { title: '中学生', method: () => filterCLassesByName('中学'), color: 'from-teal-300 via-emerald-400 to-green-400' },
    { title: '高校1年生', method: () => filterCLassesByName('高校1年'), color: setScrollColor('1年') },
    { title: '高校2年生', method: () => filterCLassesByName('高校2年'), color: setScrollColor('2年') },
    { title: '高校3年生', method: () => filterCLassesByName('高校3年'), color: setScrollColor('3年') },
    { title: 'クスノキ広場', method: () => filterCLassesByFloor('クスノキ広場'), color: 'from-blue-100 via-sky-200 to-cyan-100' },
    { title: '1F', method: () => filterCLassesByFloor('1F'), color: 'from-green-300 via-emerald-400 to-teal-400' },
    { title: '2F', method: () => filterCLassesByFloor('2F'), color: 'from-purple-300 via-violet-400 to-indigo-400' },
    { title: '3F', method: () => filterCLassesByFloor('3F'), color: 'from-orange-300 via-amber-400 to-yellow-400' },
    { title: '4F', method: () => filterCLassesByFloor('4F'), color: 'from-cyan-300 via-sky-400 to-blue-300' },
    { title: '5F', method: () => filterCLassesByFloor('5F'), color: 'from-gray-300 via-slate-400 to-zinc-400' },
    { title: '6F', method: () => filterCLassesByFloor('6F'), color: 'from-yellow-700 via-amber-600 to-orange-500' },
    { title: '中学1年生', method: () => filterCLassesByName('中学1年'), color: setScrollColor('1年') },
    { title: '中学2年生', method: () => filterCLassesByName('中学2年'), color: setScrollColor('2年') },
    { title: '中学3年生', method: () => filterCLassesByName('中学3年'), color: setScrollColor('3年') },
  ];

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        {currentCard && <Card key={tarIndex} data={currentCard} life={10} />}
      </Suspense>

      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <button onClick={backIndex} className="p-3 bg-white rounded-full shadow hover:bg-gray-100 transition" aria-label="Back">
          <BiChevronsLeft className="text-6xl text-blue-500" />
                </button>
      </div>

      {currentCard?.backImg && (
        <>
          <div
            className="fixed w-screen h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${currentCard.backImg})` }}
          />
          <div className="fixed w-screen h-screen bg-black/40" />
        </>
      )}

      <div className="fixed bottom-0 left-0 w-full z-50 opacity-10 transition-all hover:opacity-90">
        <div className="py-2 bg-gray-100">
          <ScrollContainer>
            <div className="flex my-3 items-center">
              {SCROLL_TAGS.map((value, i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 drop-shadow-lg relative cursor-pointer rounded-lg mx-[2vw] lg:mx-3 bg-gradient-to-br p-[0.5%] ${value.color} h-[10vw] lg:h-12 lg:p-[2px] inline-block`}
                >
                  <button
                    id={value.title}
                    value={value.title}
                    onClick={value.method}
                    className="hidden"
                  />
                  <label
                    htmlFor={value.title}
                    className="text-[4vw] lg:text-lg font-medium cursor-pointer flex h-full relative"
                  >
                    <div className="z-0 bg-white absolute rounded-md h-full w-full" />
                    <p className={`px-[4vw] lg:px-6 my-auto z-[5] bg-gradient-to-br text-transparent bg-clip-text ${value.color}`}>
                      {value.title}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          </ScrollContainer>
        </div>
      </div>
    </div>
  );
};

export default ShowCards;
