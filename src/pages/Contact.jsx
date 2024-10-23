import React from "react";

function Contact() {
    return (
        <div className="flex flex-wrap items-center w-full justify-center">
            {/* text */}
            <div className="bg-gray-400 h-full w-[300px]">
                <div className="">
                    <img src="https://media.licdn.com/media/AAYQAQSOAAgAAQAAAAAAAB-zrMZEDXI2T62PSuT6kpB6qg.png" alt="img" height={100} width={200} className="circle-img" />
                </div>
                {/* <div className="bg-gray-400 flex flex-wrap justify-center"> */}
                <div className="font-bold ">Alekh Srivastava</div>
                <div className="font-bold ">Phone :+91 9369687510</div>
                <div className="font-bold ">Email :iamalekhsrivastava@gmail.com</div>
                {/* </div> */}
            </div>
        </div>
    );
}

export default Contact;
