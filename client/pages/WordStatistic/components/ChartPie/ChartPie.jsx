import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart, Axis, Geom, Tooltip, Coord, Legend, Label } from 'bizcharts';
import { DataView } from '@antv/data-set';

export default class ChartPie extends Component {
  static displayName = 'ChartPie';

  static propTypes = {
    count: PropTypes.number,
    total: PropTypes.number,
    name: PropTypes.string,
  };

  static defaultProps = {
    count: 0,
    total: 0,
    name: '谓语..宾语',
  };

  constructor(props) {
    // 这里只执行一次！！！
    super(props);
    this.state = {
      count: this.props.count,
      total: this.props.total,
      name: this.props.name,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.setState({
        count: nextProps.count,
        total: nextProps.total,
        name: nextProps.name,
      });
    }
  }

  render() {
    // 参考：https://alibaba.github.io/BizCharts/
    const data = [
      { item: this.state.name, count: this.state.count },
      { item: '其他', count: (this.state.total - this.state.count) },
    ];

    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });

    const cols = {
      percent: {
        formatter: (val) => {
          val = `${val * 100}%`;
          return val;
        },
      },
    };

    return (
      <div className="chart-pie">
        <div>
          <div style={styles.number}>{ this.state.name }：{this.state.count}个</div>
          <div style={styles.number}>其他：{this.state.total - this.state.count}个</div>
          <div style={styles.number}>合计：{this.state.total}个</div>
          <Chart
            height={400}
            data={dv}
            scale={cols}
            padding={[40, 80, 80, 40]}
            forceFit
          >
            <Coord type="theta" radius={0.75} />
            <Axis name="percent" />
            {/*<Legend position="right" offsetY={-100} offsetX={-100} />*/}
            <Legend position="bottom" offsetY={-10} offsetX={0} />
            <Tooltip
              showTitle={false}
              itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
            />
            <Geom
              type="intervalStack"
              position="percent"
              color="item"
              tooltip={[
                'item*percent',
                (item, percent) => {
                  percent = `${percent * 100}%`;
                  return {
                    name: item,
                    value: percent,
                  };
                },
              ]}
              style={{ lineWidth: 1, stroke: '#fff' }}
            >
              <Label
                content="percent"
                formatter={(val, item) => {
                  return `${item.point.item}: ${val}`;
                }}
              />
            </Geom>
          </Chart>
        </div>
      </div>
    );
  }
}

const styles = {
  title: {
    margin: '0 0 10px',
    fontSize: '18px',
    paddingBottom: '15px',
    fontWeight: 'bold',
    borderBottom: '1px solid #eee',
  },
  number: {
    marginTop: '10px',
    fontSize: '16px',
  },
};
