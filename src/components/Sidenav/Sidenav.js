import React from 'react'
import './Sidenav.scss'

export default function Sidenav(props) {
    const {addZero, addOne, addTwo, addMedia, basicState} = props;
    return (
        <div className="sidenav-side" >
            <div className="side-nav" style={{backgroundColor: basicState === 0 ?  '#0d25d3' : null, color: basicState === 0 ? '#fff' : null,}} onClick={addZero}>
                <li><a>ORDERS</a></li>
            </div>
            <div style={{backgroundColor: basicState === 1 ?  '#0d25d3' : null, color: basicState === 1 ? '#fff' : null,}}  className="side-nav" onClick={addOne}>
                <li><a>BRANDING</a></li>
            </div>
            <div style={{backgroundColor: basicState === 2 ?  '#0d25d3' : null, color: basicState === 2 ? '#fff' : null,}} className="side-nav" onClick={addTwo}>
                <li><a>ACCOUNT</a></li>
            </div>
            <div style={{backgroundColor: basicState === 3 ?  '#0d25d3' : null, color: basicState === 3 ? '#fff' : null,}} className="side-nav" onClick={addMedia}>
                <li><a>Media Planning</a></li>
            </div>
        </div>
    )
}


const myStyle = {
    backgroundColor: '#fff'
}
