/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-05 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import {
  Form,
  InputNumber,
  Button,
  Radio
} from 'antd'
import {
  startLoading,
  endLoading
} from 'utils/index'
const createForm = Form.create
const FormItem = Form.Item
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
export default createForm()(Wrapper(React.createClass({
  getInitialState: function() {
    return {
      IsMain: false,
      IsFen: false,
      confirmLoading: false
    }
  },
  componentDidMount() {
    this.refreshDataCallback()
  },
  componentWillUpdate(nextProps, nextState) {
    return false
  },
  componentWillUnmount() {
    this.ignore = true
  },
  refreshDataCallback() {
    startLoading()
    this.setState({
      confirmLoading: true
    })
    ZGet('Warehouse/wareSettingGet', ({d}) => {
      this.setState({
        IsMain: d.IsMain,
        IsFen: d.IsFen,
        confirmLoading: false
      }, () => {
        this.props.form.setFieldsValue(d)
      })
    }, () => {
      this.setState({
        confirmLoading: false
      })
    }).then(endLoading)
  },
  handleSubmit(e) {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      console.log(values)
      if (errors) {
        return
      }
      startLoading()
      this.setState({
        confirmLoading: true
      })
      ZPost('Warehouse/modifyWareSetting', values, () => {
        this.refreshDataCallback()
      }, () => {
        endLoading()
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
  },
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const {IsFen, IsMain} = this.state
    return (
      <div className={styles.main}>
        <div className={styles.toolbar}>
          <h3>应用增强设置</h3>
          <div className='pull-right'>
            <Button icon='save' type='ghost' onClick={this.handleSubmit} loading={this.state.confirmLoading}>保存设置</Button>
          </div>
          <div className='clearfix' />
        </div>
        <Form horizontal className='pos-form h-scroller' style={{overflow: 'auto'}}>
          <div className={styles.table}>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>特殊单订单，锁定库存</h3>
                <div className={styles.intro}>被标识为特殊单的订单，锁定库存，发货后减少实物库存，如果不启用，将不锁定库存，并且发货后也不减少实物库存</div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('LockSku', {
                    rules: [
                      { required: true, message: '必选' }
                    ]
                  })(
                    <RadioGroup size='small'>
                      <RadioButton value='1'>锁定库存</RadioButton>
                      <RadioButton value='0'>不锁定</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>仓位精确库存</h3>
                <div className={styles.intro}>库存精确到具体仓位，以及存货箱，开通仓位精确库存后，必须通过手执枪进行仓库相关业务操作，否则库存将不准确 （<span>商家启用唯一码，强制开通</span>）</div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('IsPositionAccurate', {
                    rules: [
                      { required: true, message: '必选' }
                    ]
                  })(
                    <RadioGroup size='small'>
                      <RadioButton value='1'>开通</RadioButton>
                      <RadioButton value='0'>关闭</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>
            <fieldset style={{display: getFieldValue('IsPositionAccurate') === '0' ? 'none' : 'block'}}>
              <div className={styles.tr}>
                <div className={styles.td}>
                  <h3>允许直接登记采购入库单并审核入库</h3>
                  <div className={styles.intro}>
                    <strong>开启时</strong>：可以通过手工制单的方式的直接入库，直接入库将不装箱，库存直接入对应仓库的暂存位。<br />
                    <strong>关闭时</strong>：必须通过进仓点数或手执直接上架入库的方式入库。
                  </div>
                </div>
                <div className={styles.td}>
                  <FormItem>
                    {getFieldDecorator('OrderStore', {
                      rules: [
                        { required: true, message: '必选' }
                      ]
                    })(
                      <RadioGroup size='small'>
                        <RadioButton value='1'>开通</RadioButton>
                        <RadioButton value='0'>关闭</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </div>
              <div className={styles.tr}>
                <div className={styles.td}>
                  <h3>拣货方式</h3>
                  <div className={styles.intro}>
                    手执拣货：通过手执提示一步一步拣货，拣好的货物库存放到拣货暂存位。<br />
                    纸质拣货：按纸质进行拣货，库存不动。实际发货从仓位减去库存，如果一个商品存在多个仓位，可能仓位扣减不准确。拣货过程中可以直接分拣。
                  </div>
                </div>
                <div className={styles.td}>
                  <FormItem>
                    {getFieldDecorator('PickingMethod', {
                      rules: [
                        { required: true, message: '必选' }
                      ]
                    })(
                      <RadioGroup size='small'>
                        <RadioButton value='1'>手执拣货</RadioButton>
                        <RadioButton value='2'>纸质拣货</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </div>
              <fieldset style={{display: getFieldValue('PickingMethod') === '2' ? 'block' : 'none'}}>
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <h3>一单多货打印拣货单时同时打印小订单</h3>
                    <div className={styles.intro}>
                      如果打印小订单，在出库验货时扫描小订单将自动打印快递单
                    </div>
                  </div>
                  <div className={styles.td}>
                    <FormItem>
                      {getFieldDecorator('OneMorePrint', {
                        rules: [
                          { required: true, message: '必选' }
                        ]
                      })(
                        <RadioGroup size='small'>
                          <RadioButton value='1'>开通</RadioButton>
                          <RadioButton value='0'>关闭</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </div>
                </div>
              </fieldset>
              <div className={styles.tr}>
                <div className={styles.td}>
                  <h3>一单一货批次绑定订单</h3>
                  <div className={styles.intro}>
                    生成一单一货的拣货批次时即绑定订单，<span>请勿在发货过程中修改该设置</span><br />
                    该次拣货的商品只能是生成批次的订单出库，如果存在商品富余，一般也不可以做为其它需要该商品的订单所出库。<br />
                    一旦选择绑定订单，一单一货连打功能失效，自由拣货的商品一般也无法扫描出库。<br />
                    <span>如无特殊需求，强烈建议关闭该功能。</span>
                  </div>
                </div>
                <div className={styles.td}>
                  <FormItem>
                    {getFieldDecorator('SingleGoods', {
                      rules: [
                        { required: true, message: '必选' }
                      ]
                    })(
                      <RadioGroup size='small'>
                        <RadioButton value='1'>开通</RadioButton>
                        <RadioButton value='0'>关闭</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </div>
              <div className={styles.tr}>
                <div className={styles.td}>
                  <h3>分段拣货</h3>
                  <div className={styles.intro}>
                    多人对一批次同时分段拣货。开通后可以同时操作，但会稍微增加拣货步骤，同时增加合并拣货批次的工作。拣货区面积少于2000平且在同一层，强烈不建议开启。
                    <span>请勿在拣货过程中开启或关闭该功能</span>。
                  </div>
                </div>
                <div className={styles.td}>
                  <FormItem>
                    {getFieldDecorator('SegmentPicking', {
                      rules: [
                        { required: true, message: '必选' }
                      ]
                    })(
                      <RadioGroup size='small'>
                        <RadioButton value='1'>开通</RadioButton>
                        <RadioButton value='0'>关闭</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </div>
              <div className={styles.tr}>
                <div className={styles.td}>
                  <h3>仓位货物置放规则</h3>
                  <div className={styles.intro}>
                    <strong>一仓多货</strong>：可以节省仓位，缩小拣货区面积。<br />
                    <strong>仓一货</strong>：便于日常管理。
                  </div>
                </div>
                <div className={styles.td}>
                  <FormItem>
                    {getFieldDecorator('IsGoodsRule', {
                      rules: [
                        { required: true, message: '必选' }
                      ]
                    })(
                      <RadioGroup size='small'>
                        <RadioButton value='1'>开通</RadioButton>
                        <RadioButton value='0'>关闭</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </div>
              <div className={styles.tr}>
                <div className={styles.td}>
                  <h3>零拣区找不到商品时自动盘亏当前仓位</h3>
                  <div className={styles.intro}>
                    建议开启自动盘亏功能，如果关闭该功能，本次拣货将跳过该仓位，但其它批次将会继续提示去该仓位拣货。
                  </div>
                </div>
                <div className={styles.td}>
                  <FormItem>
                    {getFieldDecorator('AutoLossc', {
                      rules: [
                        { required: true, message: '必选' }
                      ]
                    })(
                      <RadioGroup size='small'>
                        <RadioButton value='1'>开通</RadioButton>
                        <RadioButton value='0'>关闭</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </div>
              <div className={styles.tr}>
                <div className={styles.td}>
                  <h3>大单拣货成时自动出库</h3>
                  <div className={styles.intro}>
                    如果拣货完成，默认自动出库，如果希望继续验货，请关闭该功能。
                  </div>
                </div>
                <div className={styles.td}>
                  <FormItem>
                    {getFieldDecorator('AutoDelivery', {
                      rules: [
                        { required: true, message: '必选' }
                      ]
                    })(
                      <RadioGroup size='small'>
                        <RadioButton value='1'>开通</RadioButton>
                        <RadioButton value='0'>关闭</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </div>
              <div className={styles.tr}>
                <div className={styles.td}>
                  <h3>拣货暂存位禁止负库存</h3>
                  <div className={styles.intro}>
                    当发货时，如果拣货位系统没有库存，即便实物存在，也不允许发货，必须再拣货才允许发货。<br />
                    库存校验不分批次，也不区分单件与多件。 开通该选项，可能影响发货效率。
                  </div>
                </div>
                <div className={styles.td}>
                  <FormItem>
                    {getFieldDecorator('PickingNoMinus', {
                      rules: [
                        { required: true, message: '必选' }
                      ]
                    })(
                      <RadioGroup size='small'>
                        <RadioButton value='1'>开通</RadioButton>
                        <RadioButton value='0'>关闭</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </div>
            </fieldset>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>从商品维护导入商品信息时，默认禁止同步库存</h3>
                <div className={styles.intro}>
                  开启本选项后，从商品维护导入商品信息时，将默认禁止同步库存，如需同步个别商品，请单独进行设置。
                </div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('SynchroSku', {
                    rules: [
                      { required: true, message: '必选' }
                    ]
                  })(
                    <RadioGroup size='small'>
                      <RadioButton value='1'>开通</RadioButton>
                      <RadioButton value='0'>关闭</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>采购入库超入处理</h3>
                <div className={styles.intro}>
                  采购入库情况下，入库数量大于采购数量的处理方式。默认超出数量允许入库。<br />
                  <span>预警提示方式会在多用户同时操作同一采购单入库情况下产生误差，请慎重选择。</span>
                </div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('IsBeyondCount', {
                    rules: [
                      { required: true, message: '必选' }
                    ]
                  })(
                    <RadioGroup size='small'>
                      <RadioButton value='1'>允许入库</RadioButton>
                      <RadioButton value='2'>禁止入库</RadioButton>
                      <RadioButton value='3'>预警提示</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>手执拣货一单多货，边拣边播</h3>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('SendOnPicking', {
                    rules: [
                      { required: true, message: '必选' }
                    ]
                  })(
                    <RadioGroup size='small'>
                      <RadioButton value='1'>开通</RadioButton>
                      <RadioButton value='0'>关闭</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>
            <fieldset style={{display: getFieldValue('SendOnPicking') === '1' ? 'block' : 'none'}}>
              <div className={styles.tr}>
                <div className={styles.td}>
                  <h3>边拣边播，拣货完成自动出库</h3>
                </div>
                <div className={styles.td}>
                  <FormItem>
                    {getFieldDecorator('PickedAutoSend', {
                      rules: [
                        { required: true, message: '必选' }
                      ]
                    })(
                      <RadioGroup size='small'>
                        <RadioButton value='1'>开启</RadioButton>
                        <RadioButton value='0'>关闭</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </div>
            </fieldset>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>播种柜层高</h3>
                <div className={styles.intro}>
                  几层高的播种柜，如果非共享的播种柜，每个柜的层高必须一致。
                </div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('CabinetHeight', {
                    rules: [
                      { type: 'number', required: true, message: '必填' }
                    ]
                  })(
                    <InputNumber min={0} />
                  )}
                </FormItem>
              </div>
            </div>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>播种柜列数</h3>
                <div className={styles.intro}>
                  播种柜列数，播种柜有每层几格。
                </div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('CabinetColumn', {
                    rules: [
                      { type: 'number', required: true, message: '必填' }
                    ]
                  })(
                    <InputNumber min={0} />
                  )}
                </FormItem>
              </div>
            </div>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>播种柜总格数</h3>
                <div className={styles.intro}>
                  共享播种柜有效。
                </div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('CabinetNum', {
                    rules: [
                      { type: 'number', required: true, message: '必填' }
                    ]
                  })(
                    <InputNumber min={0} />
                  )}
                </FormItem>
              </div>
            </div>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>限定由拣货员本人播种</h3>
                <div className={styles.intro}>
                  由拣货员本人播种，否则其它播种员可以认领未播种的批次
                </div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('LimitSender', {
                    rules: [
                      { required: true, message: '必选' }
                    ]
                  })(
                    <RadioGroup size='small'>
                      <RadioButton value='1'>限定拣货员本人播种</RadioButton>
                      <RadioButton value='0'>不限定</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>播种时是否需要输入数量</h3>
                <div className={styles.intro}>
                  当播种时当一个订单某个商品需要多个数量，是否直接输入数量播种。如果不输入数量，则每个商品均扫描进行播种
                </div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('SendUseCount', {
                    rules: [
                      { required: true, message: '必选' }
                    ]
                  })(
                    <RadioGroup size='small'>
                      <RadioButton value='1'>输入数量</RadioButton>
                      <RadioButton value='2'>逐一扫描</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>混合拣货</h3>
                <div className={styles.intro}>
                  拣货同时可以从存货区拣货按箱拣货，同时从货架位拣货。<br />
                  逻辑为：假如商品单件数量超过一箱，可以按箱拣货。<br />
                  请设置好【<span>仓位找货优先级</span>】确保优先按箱拣货。<br />
                  <span>如无特殊需求，强烈建议关闭该功能</span>。
                </div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('MixedPicking', {
                    rules: [
                      { required: true, message: '必选' }
                    ]
                  })(
                    <RadioGroup size='small'>
                      <RadioButton value='1'>开启</RadioButton>
                      <RadioButton value='0'>关闭</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>打单界面模块 </h3>
                <div className={styles.intro}>
                  开启精确库存，不建议使用直接发货功能。<br />
                  <strong>减拣货暂存位库存</strong>：直接扣减暂存位库存。<br />
                  <strong>减仓位库存</strong>：减商品对应所在的拣货仓位上的库存，如果拣货仓位上的库存不足，则减暂存位库存
                </div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('ReduceStock', {
                    rules: [
                      { required: true, message: '必选' }
                    ]
                  })(
                    <RadioGroup size='small'>
                      <RadioButton value='1'>减拣货暂存位库存</RadioButton>
                      <RadioButton value='2'>减仓位库存</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>
            <div className={styles.tr}>
              <div className={styles.td}>
                <h3>一单一货连打发货锁定订单时间（秒）</h3>
                <div className={styles.intro}>
                  当值为小于等于0时不锁定。<br />
                  连打发送指定时开始锁定，在锁定时间范围内的订单不会在下一次任务时被找到。
                </div>
              </div>
              <div className={styles.td}>
                <FormItem>
                  {getFieldDecorator('LockTime', {
                    rules: [
                      { type: 'number', required: true, message: '必选' }
                    ]
                  })(
                    <InputNumber min={0} />
                  )}
                </FormItem>
              </div>
            </div>
            {IsMain ? (
              <div>
                <div className='hr' />
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <h3>商品唯一码</h3>
                  </div>
                  <div className={styles.td}>
                    <FormItem>
                      {getFieldDecorator('GoodsUniqueCode', {
                        rules: [
                          { required: true, message: '必选' }
                        ]
                      })(
                        <RadioGroup size='small'>
                          <RadioButton value='1'>开通</RadioButton>
                          <RadioButton value='0'>关闭</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <h3>唯一码前缀</h3>
                    <div className={styles.intro}>
                      <strong>重新数字编码</strong>：系统重新生成数字前缀，唯一码表现为：数字前缀+流水号<br />
                      <strong>商品编码</strong>：前缀与商品编码相同，唯一码表现为：商品编码+流水号<br />
                      已生成的前缀不受该设定影响
                    </div>
                  </div>
                  <div className={styles.td}>
                    <FormItem>
                      {getFieldDecorator('CodePre', {
                        rules: [
                          { required: true, message: '必选' }
                        ]
                      })(
                        <RadioGroup size='small'>
                          <RadioButton value='1'>采用商品编码</RadioButton>
                          <RadioButton value='2'>重新数字编码</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <h3>商品维护批量生成商品编码的间隔符</h3>
                    <div className={styles.intro}>
                      允许在商品维护界面通过按钮快捷生成商品编码时编码各部分拼接规则，只能选择 - / .以及 (无)，<br />如无特殊需求，建议选择 -
                    </div>
                  </div>
                  <div className={styles.td}>
                    <FormItem>
                      {getFieldDecorator('IntervalChar', {
                        rules: [
                          { required: true, message: '必选' }
                        ]
                      })(
                        <RadioGroup size='small'>
                          <RadioButton value='1'> - </RadioButton>
                          <RadioButton value='2'> / </RadioButton>
                          <RadioButton value='3'> . </RadioButton>
                          <RadioButton value='4'> 无 </RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </div>
                </div>
              </div>
            ) : null}
            {IsFen ? (
              <div>
                <div className='hr' />
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <h3>一单多货验货只需要扫描快递单号</h3>
                    <div className={styles.intro}>
                      如果开通，则不再检验商品明细，默认所有商品与播种时完全一致。<br />
                      开通该功能将提高发货速度，但会影响发货商品的准确度，一般情况下不建议开通。
                    </div>
                  </div>
                  <div className={styles.td}>
                    <FormItem>
                      {getFieldDecorator('OneMoreOnlyEx', {
                        rules: [
                          { required: true, message: '必选' }
                        ]
                      })(
                        <RadioGroup size='small'>
                          <RadioButton value='1'>开通</RadioButton>
                          <RadioButton value='0'>关闭</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </div>
                </div>
              </div>
            ) : null}
            <div className='gray mt10'>
              <div className='tr mt20'>
                修改之后记得点击右上角【保存设置】按钮
              </div>
            </div>
          </div>
          <div style={{marginBottom: '1em'}} className='clearfix' />
        </Form>
      </div>
    )
  }
})))
