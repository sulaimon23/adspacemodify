import React from 'react'
import './Sidenav.scss'

export default function Sidenav(props) {
    const {addZero, addOne, addTwo, basicState} = props;
    return (
        <div className="sidenav-side" >
            <div className="side-nav" style={{backgroundColor: basicState === 0 ?  '#0d25d3' : null, color: basicState === 0 ? '#fff' : null,}} onClick={addZero}>
                <li><h3>ORDERS</h3></li>
            </div>
            <div style={{backgroundColor: basicState === 1 ?  '#0d25d3' : null, color: basicState === 1 ? '#fff' : null,}}  className="side-nav" onClick={addOne}>
                <li><h3>BRANDING</h3></li>
            </div>
            <div style={{backgroundColor: basicState === 2 ?  '#0d25d3' : null, color: basicState === 2 ? '#fff' : null,}} className="side-nav" onClick={addTwo}>
                <li><h3>ACCOUNT</h3></li>
            </div>
        </div>
    )
}


const myStyle = {
    backgroundColor: '#fff'
}
