"use client"
import { supabase } from '@/lib/supabaseClient';
import React, { Suspense, useEffect, useRef, useState } from 'react'
import ShowCards from './ShowCards';
type RawContent ={
    className:string,
    title:string,
    place:string,
    time:string[],
    comment:string,
    imageURL:string,
    imageVersion:string,
    imageBackURL:string,
    type:string[],
    genre:string[],
    waitTime:number,
    
}
type Content = {
    className:string,
    title:string,
    place:string,
    time:string[],
    comment:string,
    backImg:string,
    frontImg:string,
    types:string[],
    waitTime:number,
}
type RawIntro ={
    className:string,
    title:string,
    content:string,
}
type Intro = {
    tagline:string,//キャッチコピー
    content:string,
}
type Event ={
    className:string,
    title:string,
    place:string,
    time:string[],
    comment:string,
    backImg:string,
    frontImg:string,
    types:string[],
    waitTime:number,
    tagline:string,//キャッチコピー
    content:string,
}
const PageInner = () => {
    const EventRef = useRef<Event[]>([])
    const fetchData  = async ()=>{
    const {data:rawevents} = await supabase.from('contents').select(`className,comment,place,type,genre,waitTime,title,imageURL,imageVersion,imageBackURL,time` );
    const {data:intro} = await supabase.from("introduction").select("className,title,content");
    const intros = intro as RawIntro[]
    const events = rawevents as RawContent[]
    if(!events) return;
    const CLASSDATA:Event[] = events.map((value)=>{
        const tmp = [value.type,...(value.genre ?? [])];
        const newTypes = tmp.flat();
        const newTime = [...(value.time ?? "終日開催")];
        let frontImg = "/1725741490270.jpg";
        let backImg = "/1725741490270.jpg"
        if(value.imageURL){
            const filePath = value.imageURL;
                    const version = value.imageVersion;
                    const {data}= supabase
                    .storage
                    .from("class-img")
                    .getPublicUrl(filePath)
                    const url = `${data.publicUrl}?v=${version}`;
                    frontImg = url;
        }
        if(value.imageBackURL){
            const filePath = value.imageBackURL;
                    const version = value.imageVersion;
                    const {data}= supabase
                    .storage
                    .from("class-img")
                    .getPublicUrl(filePath)
                    const url = `${data.publicUrl}?v=${version}`;
                    backImg = url;
        }
        //ここでintroからキャッチコピーを探す
        let tagline = "キャッチコピー"
        let content = "説明"
        const tar = intros.find((item)=>item.className == value.className);
        if(tar){
            tagline = tar.title,
            content = tar.content
        }
        return {
            className:value.className,
            title:value.title,
            place:value.place,
            time:newTime,
            comment:value.comment,
            backImg:backImg,
            frontImg:frontImg,
            types:newTypes,
            waitTime:value.waitTime,
            tagline:tagline,
            content:content
        }
    })
    const sorted = CLASSDATA.sort((a,b)=> a.className.localeCompare(b.className))
    EventRef.current= sorted
    console.log(sorted);

    
    

    }
    useEffect(()=>{
        fetchData();
    const subscription = supabase
        .channel('contents-realtime')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'contents',
          },
          (payload) => {
            // ここで eventRef.current を更新
            const tmp = payload.new
            const index = EventRef.current.findIndex(item => item.className === tmp.className)

            if (index !== -1) {
                const tmpTypes = [tmp.type, ...(tmp.genre ?? [])]
                const newTypes = tmpTypes.flat()
                const newTime = Array.isArray(tmp.time) ? tmp.time : [tmp.time ?? '終日開催']
                                let frontImg = "/1725741490270.jpg";
                let backImg = "/1725741490270.jpg"
                if(tmp.imageURL){
                    const filePath = tmp.imageURL;
                            const version = tmp.imageVersion;
                            const {data}= supabase
                            .storage
                            .from("class-img")
                            .getPublicUrl(filePath)
                            const url = `${data.publicUrl}?v=${version}`;
                            frontImg = url;
                }
                if(tmp.imageBackURL){
                    const filePath = tmp.imageBackURL;
                            const version = tmp.imageVersion;
                            const {data}= supabase
                            .storage
                            .from("class-img")
                            .getPublicUrl(filePath)
                            const url = `${data.publicUrl}?v=${version}`;
                            backImg = url;
                }
                const newData: Event = {
                  className: tmp.className,
                  title: tmp.title,
                  place: tmp.place,
                  time: newTime,
                  comment: tmp.comment,
                  backImg: backImg,
                  frontImg: frontImg,
                  types: newTypes,
                  waitTime: tmp.waitTime,
                  tagline: EventRef.current[index].tagline,
                  content: EventRef.current[index].content,
                }
          
                console.log(newData);
                EventRef.current[index] = newData
          
            }
          }
        )
            .subscribe()
    const subscription2 = supabase
        .channel("introduction")
        .on(
                "postgres_changes",
                {
                event: 'UPDATE',
                schema: 'public',
                table: 'introduction',
                },
                (payload) => {
                // ここで eventRef.current を更新
                const tmp = payload.new
                const index = EventRef.current.findIndex(item => item.className === tmp.className)
                if (index !== -1) {
                    const tagline = tmp.title || "キャッチコピー"
                    const content = tmp.content || "説明"
                    const newData: Event = {
                        className: EventRef.current[index].className,
                        title: EventRef.current[index].title,
                        place: EventRef.current[index].place,
                        time: EventRef.current[index].time,
                        comment: EventRef.current[index].comment,
                        backImg: EventRef.current[index].backImg,
                        frontImg: EventRef.current[index].frontImg,
                        types: EventRef.current[index].types,
                        waitTime: EventRef.current[index].waitTime,
                        tagline: tagline,
                        content:content,
                    }
                    console.log(newData);
                    console.log("更新しました")
                    EventRef.current[index] = newData
                    }
                  }
                )
            .subscribe()
      return () => {
        supabase.removeChannel(subscription);
        supabase.removeChannel(subscription2)
      }

    },[])
  return (
        <ShowCards eventRef = {EventRef} />
  )
}

export default PageInner