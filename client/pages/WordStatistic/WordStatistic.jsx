import React, { Component } from 'react';
import { Grid } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import ChartPie from './components/ChartPie';
import CompositeFilter from './components/CompositeFilter';
import SimpleTable from './components/SimpleTable';

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

  render() {
    return (
      <div className="word-statistic-page">
        <CompositeFilter onSearchDone={this.onSearchDone.bind(this)} />
        <IceContainer>
          <h4 style={styles.title}>统计</h4>
          <Row style={{ paddingLeft: '20px' }} wrap>
            <Col l="10">
              <ChartPie count={this.state.count} total={this.state.total} name={this.state.name} />
            </Col>
            <Col l="14">
              <SimpleTable tableData={this.state.result} />
            </Col>
          </Row>
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
};
