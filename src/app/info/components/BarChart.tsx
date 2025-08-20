"use client"
import { supabase } from '@/lib/supabaseClient'
import { randomUUID, UUID } from 'crypto'
import React, { useEffect, useRef, useState } from 'react'
type classMap ={
  id:number,
  className:string,
  waitTime:number,
  prevTime:number
}
const BarChart = () => {
  const [classMap,setClassMap] = useState<classMap[]>();
  const channelRef = useRef<string>("realtime");
  useEffect(()=>{
    channelRef.current = crypto.randomUUID();
    const channel = supabase
      .channel(channelRef.current)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'contents',
      }, (payload) => {
        console.log('変更検知');
        const tmp = payload.new;
        const updated:classMap = {
          id:tmp.id as number,
          className:tmp.className as string,
          waitTime:tmp.waitTime as number ,
          prevTime:tmp.prevTime as number,
        }
        setClassMap((prev)=>{
          if(!prev) return prev
          return prev.map((item)=>item.id == updated.id ? updated : item)
        })
      })
      .subscribe()
    
    const fetch = async ()=>{
      const {data,error} = await supabase.from("contents").select("id,className,waitTime,prevTime");
      if(!data?.[0] || error){
        return alert("error");
      }

      const tmp = data as classMap[];
      setClassMap(tmp);
    }
    fetch();
    return () => {
      supabase.removeChannel(channel)
    }
    
  },[])
  return (
    <div>BarChart</div>
  )
}

export default BarChart