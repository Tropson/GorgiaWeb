import React,{useEffect,useState} from 'react'
import Button from '../Components/Button';
import Logo from '../Components/logo.jsx'
import decodeRole from '../Helpers/DecodeRole';

export default function HomePage() {
    
    const [selection,setSelection]= useState(1);

    useEffect(()=>{
        setSelection(2);
    },[])

    return (
        <div style={{minHeight:'100vh',width:'calc(100vw)',display:"flex",justifyContent:"center",alignItems:"center",flexDirection:'column'}}>
                <Logo>
                    <img src={require('../Assets/georgialogo.png')}></img>
                </Logo>
                <div style={{display:"flex",width:'100%',minHeight:400,justifyContent:'center',alignItems:'center'}}>
                    <Button onClick={()=>{window.location.href="/return"}} background="#E1E2E1">
                        <h1 style={{color:'black'}}>Return Book</h1>
                    </Button>
                    <Button onClick={()=>{window.location.href="/borrow"}} background="#67C2E8">
                        <h1 style={{color:'white'}}>Borrow book</h1>
                    </Button>
                </div>
                {decodeRole()==="student"?null:<div style={{display:"flex",flexWrap:"wrap",marginBottom:20,width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <Button onClick={()=>{window.location.href="/catalogue"}} background="#67C2E8">
                        <h1 style={{color:'white'}}>Catalogue</h1>
                    </Button>
                    <Button onClick={()=>{window.location.href="/statistics"}} background="#E1E2E1">
                        <h1 style={{color:'black'}}>Statistics</h1>
                    </Button>
                </div>}
        </div>
    )
}
