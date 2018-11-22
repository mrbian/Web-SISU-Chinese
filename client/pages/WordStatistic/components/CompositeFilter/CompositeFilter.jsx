import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Search, Tab, Grid, Tag, DatePicker } from '@icedesign/base';
import { ToastContainer } from 'react-toastr';
import IceContainer from '@icedesign/container';
import { enquireScreen } from 'enquire-js';
import Request from 'superagent';
import './toastr.scss';

const TabPane = Tab.TabPane;

// 默认排除"到"和"CC"

export default class CompositeFilter extends Component {
  static displayName = 'CompositeFilter';

  static propTypes = {
    onSearchDone: PropTypes.func,
  };

  static defaultProps = {
    onSearchDone: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      predicateValue: '',
      objectValue: '',
      skey: '',
      cachedRes: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.enquireScreenRegister();
  }

  updatePredicateValue(evt) {
    this.setState({
      predicateValue: evt.target.value,
    });
  }

  updateObjectValue(evt) {
    this.setState({
      objectValue: evt.target.value,
    });
  }

  enquireScreenRegister = () => {
    const mediaCondition = 'only screen and (max-width: 720px)';

    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    }, mediaCondition);
  };

  onTabChange = (key) => {
    console.log(`select tab is: ${key}`);
  };

  onTagChange = (key, selected) => {
    console.log(`Tag: ${key} is ${selected ? 'selected' : 'unselected'}`);
  };

  onSearch = (obj) => {
    const skey = obj.key;
    this.searchAndAnalyze.bind(this)(skey);
  };

  renderTabBarExtraContent = () => {
    return (
      <div style={styles.extraFilter}>
        <Search
          placeholder="搜索语料库"
          searchText=""
          inputWidth={150}
          onSearch={this.onSearch}
          style={styles.search}
        />
      </div>
    );
  };

  searchAndAnalyze(skey) {
    if (!skey || !this.state.predicateValue || !this.state.objectValue) {
      alert('值不合法，请检查是否为空');
      return;
    }

    // 生成正则表达式
    const predicateValue = this.state.predicateValue;
    const objectValue = this.state.objectValue;
    const regx = new RegExp(`(${predicateValue}(\\{[^C]\\})+[^到^\\n]*${objectValue}|${predicateValue}[^\\{^到]{1}[^到^\\n]*${objectValue}|${predicateValue}${objectValue})`, 'g');

    if (skey !== this.state.skey) {
      // 更新搜索字
      this.setState({
        skey,
      });
      // 显示遮罩层
      document.getElementById('mask').style.display = 'block';
      // 显示提示
      this.container.warning('请求时间较长，请耐心等待', '注意', {
        closeButton: true,
      });
      // 获取数据并进行筛选
      Request
        .get('/api/bbchsk')
        .query({ skey })
        .query({ limit: 1000000 })
        .query({ offset: 0 })
        .set('Accept', 'application/json')
        .then(res => {
          // 隐藏遮罩层
          document.getElementById('mask').style.display = 'none';
          console.log('Request Done');
          res = JSON.parse(res.text);
          console.log(res);
          if (res.code && parseInt(res.msg.total, 10)) {
            // 符合要求的个数
            let count = 0;
            // 结果数组
            let result = [];
            // 总数
            const total = parseInt(res.msg.total, 10);
            res = res.msg.instances;
            // cache
            this.state.cachedRes = res;
            this.state.total = total;
            res.forEach((ele) => {
              if (regx.test(ele.pz)) {
                count += 1;
                result.push(ele);
              }
            });
            console.log('Process Done', count, total);
            this.props.onSearchDone(count, total, result, {
              skey, predicateValue, objectValue,
            });
          } else {
            alert('数据请求发生错误');
          }
        });
    } else {
      let count = 0;
      let result = [];
      this.state.cachedRes.forEach((ele) => {
        if (regx.test(ele.pz)) {
          count += 1;
          result.push(ele);
        }
      });
      this.props.onSearchDone(count, this.state.total, result, {
        skey, predicateValue, objectValue,
      });
    }
  }

  render() {
    return (
      <div className="composite-filter">
        <ToastContainer
          ref={ref => this.container = ref}
          className="toast-top-right"
          style={{
            zIndex: 1000,
          }}
        />
        <IceContainer style={styles.filterCard}>
          <Tab
            type="text"
            onChange={this.onTabChange}
            contentStyle={{ display: 'none' }}
            tabBarExtraContent={
              !this.state.isMobile ? this.renderTabBarExtraContent() : null
            }
          >
            <TabPane tab="谓宾过滤模式" key="all" />
          </Tab>

          <div style={styles.tagList}>
            <div style={styles.inputTag}>
              <label htmlFor="predicate">谓语：</label>
              <input name="predicate" type="text" style={styles.input} value={this.state.predicateValue} onChange={this.updatePredicateValue.bind(this)} />
            </div>
            <div style={styles.inputTag}>
              <label htmlFor="predicate">宾语：</label>
              <input name="object" type="text" style={styles.input} value={this.state.objectValue} onChange={this.updateObjectValue.bind(this)} />
            </div>
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  filterCard: {
    position: 'relative',
    padding: 10,
  },
  tagList: {
    marginTop: '10px',
  },
  extraFilter: {
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'row',
  },
  search: {
    marginLeft: '12px',
  },
  inputTag: {
    float: 'left',
    marginLeft: '28px',
  },
  input: {
    textDecoration: 'none',
    outline: 'none',

  },
};
