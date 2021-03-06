import React,{useEffect,useState} from 'react'
import Logo from '../Components/logo.jsx'
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import BookReturnService from '../Network/BookReturnService';
import BookListing from '../Components/BookListing';
import BookReturnListing from '../Components/BookReturnListing'
import UserService from '../Network/UserService';

export default function ReturnPage() {
    const [id,setId]=useState('');
    const [active,setActive]=useState('number');
    var [booksReturned,setBooksReturned]=useState([]);
    var [bookReturnIds,setBookReturnIds]=useState([])
    var [isCorrect, setCorrect] = useState(true)
    var [isReturned, setReturned] = useState(false)

    const confirm=()=>{
        setReturned(false);
        setCorrect(true)
        BookReturnService.returnBook({bookCatalogId: id}).then(x=>{
            var bookIds = [...bookReturnIds];
            bookIds.push(id)
            setBookReturnIds(bookIds)
            var borrowedBooks=[...booksReturned];
            borrowedBooks.push('Returned');
            setBooksReturned(borrowedBooks);
        }).catch(x=>{
            setCorrect(false)
        })
    }


    useEffect(()=>{
        getBorrowings();
    },[])

    const getBorrowings=()=>{
        UserService.getCurrentBorrowings().then(x=>{
            console.log(x);
            setBooksReturned(x);
        }).catch(x=>{
            console.log(x);
        })
    }

    const onKeyPress=(value)=>{
        if(value==="bk"){
            if(active==='number'){
                setId(id.slice(0,id.length-1))
            }
            return;
        }
        if(value==="cl"){
            if(active==='number'){
                setId("")
            }
            return;
        }
        if(active==='number'){
            setId(id+value)
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
                        <img src={require('../Assets/georgialogo.png')}></img>
                    {/* </Logo> */}
                </div>
                <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',flex:4,width:'100%'}}>
                    <div style={{height:20,width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <h3 style={{color: isReturned?'green':'red'}}>{isCorrect ?isReturned?"Book returned":"": "Incorrect book ID"}</h3>
                    </div>
                    <h3>Enter book ID to return:</h3>
                    <input type="text" autocomplete="autocomplete_off_hack_xfr4!k" onKeyDown={(e) => e.preventDefault()} onFocus={()=>{setActive('number')}} style={{paddingLeft:5,paddingRight:5,borderRadius:5,border:active==='number'?'1.5px solid #67C2E8':'1px solid #999999',fontSize:24,width:300,}} name="number" onChange={(e)=>{setId(e.target.value)}} value={id}>
                    </input>
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
                {booksReturned.length>0?<div style={{width:'100vw',minHeight:200,paddingTop:20}}>
                <h3 style={{textAlign:"center"}}>Your returned books:</h3>
                <div className="bookListingTitle" style={{height:40,width:'calc(100%)',backgroundColor:'rgb(103, 194, 232)',display:'flex',flexDirection:'row',paddingLeft:'15%',paddingRight:'15%',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <h3 style={{textAlign:'center'}}>Status</h3>
                        </div>
                        <div style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <h3 style={{textAlign:'center'}}>Book id</h3>
                        </div>
                    </div>
                    {bookReturnIds.map((item,index)=>{
                        return ( <BookReturnListing key={index} item={item} even={index%2===0}></BookReturnListing> )
                    })}
                </div>:null}
        </div>
    )
}
