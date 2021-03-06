import React,{useEffect,useState} from 'react'
import Logo from '../Components/logo.jsx'
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import BookBorrowService from '../Network/BookBorrowService'
import BookListing from '../Components/BookListing';
import UserService from '../Network/UserService';
import decodeRole from '../Helpers/DecodeRole';

export default function BorrowPage() {
    const [id,setId]=useState('');
    const [ssn,setSsn]=useState('');
    const [booksBorrowed,setBooksBorrowed]=useState([]);
    const [active,setActive]=useState("id");
    const [isCorrect, setCorrect] = useState(true)

    const confirm=()=>{
        BookBorrowService.borrow({bookCatalogId: id,ssn:ssn!==''?ssn:null}).then(x=>{
            if(ssn===''){
                var borrowedBooks=[...booksBorrowed];
                borrowedBooks.push(x);
                setBooksBorrowed(borrowedBooks);
            }
        }).catch(x=>{
            console.log(x);
            setCorrect(false)
        })
    }

    useEffect(()=>{
        console.log(decodeRole());
        getBorrowings();
    },[])

    const getBorrowings=()=>{
        UserService.getCurrentBorrowings().then(x=>{
            setBooksBorrowed(x);
        }).catch(x=>{
            console.log(x);
        })
    }

    const onKeyPress=(value)=>{
        if(active==='id'){
            if(value==="bk"){
                setId(id.slice(0,id.length-1))
                return;
            }
            if(value==="cl"){
                setId("")
                return;
            }
            setId(id+value)
        }
        else if(active==="ssn"){
            if(value==="bk"){
                setSsn(ssn.slice(0,ssn.length-1))
                return;
            }
            if(value==="cl"){
                setSsn("")
                return;
            }
            setSsn(ssn+value)
        }
    }

    const done=()=>{
        console.log('Would print a receipt if we would have a printer');
        window.localStorage.removeItem('token');
        window.location.replace('/');
    }

    return (
        <div style={{height:'100vh',width:'calc(100vw)',display:"flex",justifyContent:"center",alignItems:"center",flexDirection:'column'}}>
                <div style={{display:'flex',justifyContent:'center',alignItems:'flex-end',flex:2,width:'100%'}}>
                    {/* <Logo> */}
                        <img height='80%' src={require('../Assets/georgialogo.png')}></img>
                    {/* </Logo> */}
                </div>
                <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',flex:4,width:'100%'}}>
                    <div style={{height:20,width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <h3 style={{color: 'red'}}>{isCorrect ? "": "Incorrect book ID"}</h3>
                    </div>
                    <h3>Enter book ID to borrow:</h3>
                    <input type="text" autoComplete="autocomplete_off_hack_xfr4!k" onFocus={()=>{setActive('id')}} onKeyDown={(e) => e.preventDefault()} style={{paddingLeft:5,paddingRight:5,borderRadius:5,border:active==='id'?'1.5px solid #67C2E8':'1px solid #999999',fontSize:24,width:300,}} name="number" onChange={(e)=>{setId(e.target.value)}} value={id}/>
                    {decodeRole()==="student"?null:
                    <> 
                        <h3>Enter SSN if borrowing for student:</h3>
                        <input type="text" autoComplete="autocomplete_off_hack_xfr4!k" onFocus={()=>{setActive('ssn')}} onKeyDown={(e) => e.preventDefault()} style={{paddingLeft:5,paddingRight:5,borderRadius:5,border:active==='ssn'?'1.5px solid #67C2E8':'1px solid #999999',fontSize:24,width:300,}} name="number" onChange={(e)=>{setSsn(e.target.value)}} value={ssn}/>
                    </>
                    }
                    <div style={{width:300,marginTop:20}}>
                        <Keyboard

                            layout= {{
                                default: ["1 2 3", "4 5 6", "7 8 9", "0 -", "bk cl"]
                            }}
                            display={{
                                "bk": "⌫",
                                "cl":"✖️"
                            }}
                            onChange={()=>{}}
                            onKeyPress={onKeyPress}
                        />
                    </div>
                    <div className="card_button" onClick={confirm} style={{cursor:'pointer',width:300,marginTop:20,fontSize:24,background:'#67C2E8',color:'white',border:'none',borderRadius:5,display:'flex',justifyContent:'center',alignItems:'center'}}>Confirm</div>
                    <div className="card_button" onClick={done} style={{cursor:'pointer',width:300,marginTop:20,fontSize:24,background:'#E1E2E1',color:'black',border:'none',borderRadius:5,display:'flex',justifyContent:'center',alignItems:'center'}}>Finish</div>
                </div>
                {booksBorrowed.length>0?<div style={{width:'100vw',minHeight:200,paddingTop:20}}>
                    <h3 style={{textAlign:"center"}}>Your borrowed books:</h3>
                    <div className="bookListingTitle" style={{height:40,width:'calc(100%)',backgroundColor:'rgb(103, 194, 232)',display:'flex',flexDirection:'row',paddingLeft:'15%',paddingRight:'15%',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <h3 style={{textAlign:'center'}}>Title</h3>
                        </div>
                        <div style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <h3 style={{textAlign:'center'}}>Author</h3>
                        </div>
                        <div style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <h3 style={{textAlign:'center'}}>Release Date</h3>
                        </div>
                    </div>
                    {booksBorrowed.map((item,index)=>{
                        return (<BookListing key={index} item={item} even={index%2===0}></BookListing>)
                    })}
                </div>:null}
        </div>
    )
}
