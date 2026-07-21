"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { Terminal, ShieldCheck, Lock } from "lucide-react";
import { useRouter } from "next/navigation";


export default function AuthorizationPage() {

  const router = useRouter();


  const [recoveryKey,setRecoveryKey] = useState("");
  const [engineerId,setEngineerId] = useState("");

  const [step,setStep] = useState(1);

  const [message,setMessage] = useState("");

  const [authorized,setAuthorized] = useState(false);



  // FRONTEND RECOVERY KEY VALIDATION

  function verifyRecoveryKey(){


    const regex =
      /^BLACKBOX\d{8}$/;


    if(!regex.test(recoveryKey)){

      setMessage(
        "INVALID RECOVERY KEY FORMAT"
      );

      return;

    }



    const datePart =
      recoveryKey.substring(8);



    const year =
      Number(datePart.substring(0,4));

    const month =
      Number(datePart.substring(4,6));

    const day =
      Number(datePart.substring(6,8));



    const date =
      new Date(
        year,
        month-1,
        day
      );



    if(
      date.getFullYear() !== year ||
      date.getMonth()+1 !== month ||
      date.getDate() !== day
    ){

      setMessage(
        "INVALID DATE FORMAT"
      );

      return;

    }



    setMessage(
      "PRIMARY AUTHORIZATION VERIFIED"
    );


    setStep(2);

  }





  // BACKEND ENGINEER ID CHECK

  async function verifyEngineerId(){


    if(!engineerId){

      setMessage(
        "ENGINEER ID REQUIRED"
      );

      return;

    }



    try{


      /*
        Backend API call here

        Example:

        const response =
        await fetch("/api/verify-engineer",{
          method:"POST",
          body:JSON.stringify({
            engineerId
          })
        });


      */


      // temporary success

      const backendVerified = true;



      if(backendVerified){


        setAuthorized(true);


        setMessage(
          "FINAL AUTHORIZATION GRANTED"
        );


      }

      else{


        setMessage(
          "ENGINEER ID VERIFICATION FAILED"
        );


      }


    }

    catch{


      setMessage(
        "SERVER CONNECTION FAILED"
      );

    }

  }




return (

<PageTransition>


<div className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8">


{/* TERMINAL */}


<div className="flex-1 glass-panel overflow-hidden">


<div className="
border-b
border-border
bg-surface/50
p-4
flex
items-center
gap-3
">


<Terminal
size={18}
className="text-secondary-text"
/>


<span className="
font-mono
text-sm
tracking-widest
text-secondary-text
">

AUTHORIZATION TERMINAL

</span>


</div>



<div className="
p-8
font-mono
space-y-8
">


<h1 className="
text-3xl
text-primary
font-bold
tracking-widest
">

FINAL AUTHORIZATION

</h1>





{/* STEP 1 */}


{
step===1 && (


<div className="space-y-6">


<p className="text-secondary-text">

RECOVERY KEY

</p>



<input

value={recoveryKey}

onChange={(e)=>
setRecoveryKey(e.target.value)
}

placeholder="ENTER RECOVERY KEY"

className="
w-full
bg-black
border
border-border
px-4
py-3
text-white
outline-none
focus:border-primary
"

/>



<button

onClick={verifyRecoveryKey}

className="
border
border-primary
text-primary
px-8
py-3
hover:bg-primary
hover:text-black
transition
"

>

VERIFY

</button>


</div>


)

}






{/* STEP 2 */}



{
step===2 && !authorized && (


<motion.div

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

className="space-y-6"

>


<p className="text-primary">

PRIMARY AUTHORIZATION VERIFIED

</p>



<p className="text-secondary-text">

ENGINEER ID REQUIRED

</p>



<p className="text-xs text-secondary-text">

Expected Format:

<br/>

&lt;RecoveryKey&gt;-&lt;EngineerID&gt;

</p>





<div>


<p className="text-secondary-text mb-2">

RECOVERY KEY

</p>


<input

value={recoveryKey}

readOnly

className="
w-full
bg-black
border
border-border
px-4
py-3
text-primary
"

/>


</div>





<div>


<p className="text-secondary-text mb-2">

ENGINEER ID

</p>



<input

value={engineerId}

onChange={(e)=>
setEngineerId(e.target.value)
}

placeholder="ENTER ENGINEER ID"

className="
w-full
bg-black
border
border-border
px-4
py-3
text-white
outline-none
focus:border-primary
"

/>


</div>




<button

onClick={verifyEngineerId}

className="
border
border-primary
text-primary
px-8
py-3
hover:bg-primary
hover:text-black
transition
"

>

AUTHORIZE

</button>



</motion.div>


)

}





{/* SUCCESS */}



{
authorized && (


<motion.div

initial={{
opacity:0
}}

animate={{
opacity:1
}}

className="space-y-6"

>


<p className="text-primary text-xl">

PRIMARY AUTHORIZATION VERIFIED

</p>



<p className="text-primary">

ENGINEER ID VERIFIED

</p>



<p>

WELCOME BACK, ENGINEER.

</p>




<p className="text-primary">

FINAL AUTHORIZATION GRANTED.

</p>




<div className="
text-primary
tracking-widest
">

██████████████████

<br/>

100%

</div>





<div className="space-y-2">


<p>

WEAPON UNLOCKED

</p>


<p>

TARGET CONNECTION ESTABLISHED

</p>


<p className="text-secondary-text">

Awaiting Authorization...

</p>


</div>




<button

onClick={()=>router.push(
"/final-authorization/fire-sequence"
)}

className="
border
border-primary
text-primary
px-10
py-3
hover:bg-primary
hover:text-black
transition
"

>

FIRE

</button>


</motion.div>


)

}





{
message && (

<p className="
text-danger
">

{message}

</p>

)

}



</div>


</div>






{/* STATUS PANEL */}


<div className="lg:w-80 flex flex-col gap-4">


<h2 className="
font-heading
uppercase
tracking-widest
text-secondary-text
">

Authorization Status

</h2>



<StatusCard
title="Recovery Key"
status={
step>1
?
"VERIFIED"
:
"WAITING"
}
success={step>1}
/>



<StatusCard
title="Engineer ID"
status={
authorized
?
"VERIFIED"
:
"LOCKED"
}
success={authorized}
/>



<StatusCard
title="Final Access"
status={
authorized
?
"GRANTED"
:
"DENIED"
}
success={authorized}
/>


</div>



</div>


</PageTransition>

)

}






function StatusCard({
title,
status,
success=false
}:{
title:string;
status:string;
success?:boolean;
}){


return (

<motion.div

whileHover={{
scale:1.02
}}

className={`
glass-panel
p-4
flex
justify-between
items-center
border

${
success
?
"border-primary/30 bg-primary/5"
:
"border-border"
}

`}

>


<div className="flex items-center gap-3">


{
success
?
<ShieldCheck
size={18}
className="text-primary"
/>
:
<Lock
size={18}
className="text-secondary-text"
/>
}


<span className="font-mono text-sm">

{title}

</span>


</div>


<span className="font-mono text-xs">

{status}

</span>


</motion.div>

)

}