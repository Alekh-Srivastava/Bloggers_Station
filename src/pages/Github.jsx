import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

const url = "https://github.com/Alekh-Srivastava"
export default function Github(){
    const [data,setData] = useState({})
    const apicall= function (){
        fetch(url)
        .then((res)=> res.json())
        .then ((res)=>{
            console.log("fetching ");
            setData(res)
        })
        .catch(
            ()=>{    
              console.log('error');
            }
        )
    }

    useEffect(()=>{
        apicall();
    },[])
    return (
    <>
        <div className="flex justify-center text-xl bg-slate-900 text-white">
            Hi i am {data['login']}, Click below to see my all projects.
        </div>
        {/* <div className="flex mx-auto justify-center"> 
                <img src={data['avatar_url']} alt="" height={200} width={200} />
        </div> */}
        <div className="bg-blue-50 flex justify-center">
            <Link to = {data['html_url']} target="_blank"  className="bg-red-100 rounded-full p-2 m-1"> visit Github Profile</Link>
        </div>
    </>
    )
}