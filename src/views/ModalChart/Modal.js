    

import React, {Component} from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import { Button, Modal } from 'react-bootstrap';
import './style.css'


class Modals extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartData:props.chartData,
      show: false,
    }
  }
  handleClose = () => {
    this.setState({
      show: false
    })
  };

  handleShow = () => {
    this.setState({
      show: true
    })
  }



  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right',
    location:'City'
  }

  render(){
    const {show, setShow} = this.state;

    return (
      <div className="chart"  >
        <div >
            <span variant="primary" onClick={this.handleShow}  >
            {   this.props.formatCurrency(
                                        this.props.totalPrice || 0,
                                        this.props.exchange,
                                        this.props.currency
                                      )}
      </span>
        </div>

      <Modal show={this.state.show} onHide={this.handleClose} style={{marginTop:40,}}
      dialogClassName="my-modal"
       >

        <Modal.Header closeButton>
          <Modal.Title>Ad Chart</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        {/* <Bar
          data={this.state.chartData}
          options={{
            title:{
              display:this.props.displayTitle,
              fontSize:25
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition
            }
          }}
        /> */}

        {/* <Line
          data={this.state.chartData}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'Largest Cities In '+this.props.location,
              fontSize:25
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition
            }
          }}
        /> */}

        <Pie
          data={this.state.chartData}
          options={{
            title:{
              display:this.props.displayTitle,
              fontSize:25,
              fontWeight: 900,
              textAlign: 'left',
              align: 'left'
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition
            }
          }}
        />

        </Modal.Body>
        <Modal.Footer>
          
          <Button variant="primary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
       
      </div>
    )
  }
}

export default Modals;
