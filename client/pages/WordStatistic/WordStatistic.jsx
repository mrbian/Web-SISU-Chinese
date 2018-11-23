import React, { Component } from 'react';
import { Grid } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import { ToastContainer } from 'react-toastr';
import ChartPie from './components/ChartPie';
import CompositeFilter from './components/CompositeFilter';
import SimpleTable from './components/SimpleTable';
import './components/CompositeFilter/toastr.scss';
import tableExport from 'table-export';


const { Row, Col } = Grid;

export default class WordStatistic extends Component {
  static displayName = 'WordStatistic';

  constructor(props) {
    super(props);
    this.state = {
      result: [],
      count: 0,
      total: 0,
      name: '谓语..宾语',
    };
  }

  onSearchDone(count, total, result, sText) {
    this.setState({
      count,
      total,
      result,
      name: `"${sText.skey}"中的"${sText.predicateValue}...${sText.objectValue}"`,
    });
  }

  deleteItem(item) {
    const l = this.state.result.length;
    let arr = [];
    for (let i = 0; i < l; i += 1) {
      if (this.state.result[i].id !== item.id) {
        arr.push(this.state.result[i]);
      }
    }
    this.container.success(item.pz, '删除成功', {
      closeButton: true,
    });
    this.setState({
      result: arr,
      count: this.state.count - 1,
      total: this.state.total - 1,
    });
  }

  exportTable(event) {
    const isExcel = event.target.dataset.software === 'excel';
    if (isExcel) {
      tableExport('exportTable', `"${this.state.name}统计结果"`, 'xls');
    } else {
      tableExport('exportTable', `"${this.state.name}"统计结果`, 'doc');
    }
  }

  render() {
    return (
      <div className="word-statistic-page">
        <ToastContainer
          ref={ref => this.container = ref}
          className="toast-top-right"
          style={{
            zIndex: 1000,
          }}
        />
        <CompositeFilter onSearchDone={this.onSearchDone.bind(this)} />
        <IceContainer>
          <h4 style={styles.title}>
            统计
            <div style={{ float: 'right' }}>
              <div data-software="excel" onClick={this.exportTable.bind(this)} style={styles.excelButton}>导出到Excel</div>
              <div data-software="word" onClick={this.exportTable.bind(this)} style={styles.wordButton}>导出到Word</div>
            </div>
          </h4>
          <Row style={{ paddingLeft: '20px' }} wrap>
            <Col l="10">
              <ChartPie count={this.state.count} total={this.state.total} name={this.state.name} />
            </Col>
            <Col l="14">
              <SimpleTable tableData={this.state.result} deleteItem={this.deleteItem.bind(this)} />
            </Col>
          </Row>
          <table id="exportTable" style={styles.exportTable}>
            <thead>
              <tr>
                <td>句子</td>
                <td>分数</td>
              </tr>
            </thead>
            <tbody>
              {
                this.state.result.map((ele) => {
                  return <tr><td>{ele.pz}</td><td>{ele.zh}</td></tr>;
                })
              }
            </tbody>
          </table>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: '0',
  },
  title: {
    margin: '0 0 20px',
    padding: '15px 20px',
    fonSize: '16px',
    color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: '500',
    borderBottom: '1px solid #f0f0f0',
  },
  excelButton: {
    background: 'rgb(34,103,60)',
    width: '100px',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'center',
    fontSize: '12px',
    borderRadius: '4px',
    color: '#fff',
    display: 'inline-block',
    cursor: 'pointer',
  },
  wordButton: {
    background: 'rgb(46,81,157)',
    width: '100px',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'center',
    fontSize: '12px',
    borderRadius: '4px',
    color: '#fff',
    display: 'inline-block',
    marginLeft: '8px',
    cursor: 'pointer',
  },
  exportTable: {
    display: 'none',
  },
};
