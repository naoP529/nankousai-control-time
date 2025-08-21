"use client"
export const dynamic = "force-dynamic"

import ClockArc from "@/app/info/Circle/ClockArc"
import { useSession } from "@/hooks/useSession"
import { supabase } from "@/lib/supabaseClient"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

type TimeMap = {
  id: number
  className: string
  prevTime: string
  waitTime: string
}

const Page = () => {
  const [timeMap, setTimeMap] = useState<TimeMap>()
  const [newTime, setNewTime] = useState<string>("0")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const params = useSearchParams()
  const id = params.get("id")?.toString();
  const name = params.get("name")?.toString();
  const {session , loading} = useSession();
  const router = useRouter();
  useEffect(() => {

  if (loading) return;

  // ローディングが終わって、かつ session.user がなければログインへ
  if (!session?.user) {
    router.push("/login");
  }
}, [session, loading, router]);
  useEffect(() => {
  if (loading || !session?.user || !id || !name) return;

  const initialize = async () => {
    const user_id = session.user.id;
    console.log(user_id);
    const { data: profiles, error: profileError } = 
      await supabase.from("user_profiles").select("role, TargetEditClass").eq("user_id", user_id);

    if (profileError) {
      console.log(profileError)
      alert("アカウント情報を取得できませんでした");
      return router.push("/login");
    }

    const { role, TargetEditClass } = profiles[0];
    if (role === "timer" || role === "editor") {
      console.log(role);
      if (TargetEditClass !== name) {
        if (confirm(`あなたの担当クラスは${TargetEditClass}です。変更しますか？`)) {
          return router.push("/auth/requestTimer");
        }
        return router.back();
      }
    } else if (role !== "admin") {
      if (confirm("あなたは時間を変更させる権限がありません。リクエストしますか？")) {
        return router.push("/auth/requestTimer");
      }
      return router.back();
    }

    const { data: classes, error: contentError } = await supabase .from("contents") .select("id, className, prevTime, waitTime") .eq("id", id);

    if (contentError || !classes?.length) {
      alert(contentError?.message || "データ取得失敗");
      return;
    }

    const record = classes[0] as TimeMap;
    setTimeMap(record);
    setNewTime((record.waitTime));
  };

  initialize();
}, [session, loading, id,name,router]);

  const handleUpdate = async () => {
    if (!timeMap || !id) return
    setIsLoading(true)
    const pre = Number(timeMap.waitTime);
    const now = Number(newTime)
    const { error } = await supabase
      .from("contents")
      .update({
        prevTime: pre,
        waitTime: now,
      })
      .eq("id", id)

    setIsLoading(false)

    if (error) {
      alert("更新失敗: " + error.message)
    } else {
      setTimeMap({
        ...timeMap,
        prevTime: timeMap.waitTime,
        waitTime: newTime,
      })
    }
  }

  return (
    <div className="pt-[min(15vw,80px)] h-screen bg-white md:pt-[13vw]  lg:pt-[min(15vw,80px)]">
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        クラス: {timeMap?.className || "---"}
      </h1>

      <div className="space-y-2 mb-6">
        <p className="text-gray-600">
          変更前の待機時間:{" "}
          <span className="font-medium text-gray-900">
            {timeMap?.waitTime ?? "-"}
          </span>
        </p>
        <p className="text-gray-600">
          以前の待機時間:{" "}
          <span className="font-medium text-gray-900">
            {timeMap?.prevTime ?? "-"}
          </span>
        </p>
      </div>

      <div className="flex items-center space-x-3 mb-6">
      <input
        type="text"
        inputMode="numeric"
        value={newTime}
        onChange={(e) => {
          const raw = e.target.value;
          if (/^\d*$/.test(raw)) {
            const cleaned = raw.replace(/^0+(\d)/, "$1");
            const num = cleaned === "" ? "" : String(Math.min(Number(cleaned), 180));
            setNewTime(num);
          }
        }}
        onBlur={() => {
          if (newTime === "") {
            setNewTime("0");
          }
        }}
        placeholder="新しい待機時間"
        maxLength={3}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
        <button
          onClick={handleUpdate}
          disabled={isLoading}
          className={
            "px-4 py-2 rounded text-white " +
            (isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700")
          }
        >
          {isLoading ? "更新中..." : "時間を更新"}
        </button>
      </div>
      <div className="flex items-center justify-center">
          <ClockArc minutes={Number(newTime)} />
      </div>
      
        </div>
        
          
        
    </div>
    
  )
}

export default Page