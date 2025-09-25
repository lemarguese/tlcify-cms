import './PolicyDetailPage.scss';

import Page from "@/layout/Page/Page.tsx";
import Button from "@/components/Button/Button.tsx";
import { ClockCircleOutlined } from "@ant-design/icons";

import Description from "@/components/Description/Description.tsx";
import type { TabsProps } from "antd";
import { useParams } from "react-router";

import Table from "@/components/Table/Table.tsx";
import { Table as AntTable } from 'antd';

import {
  calendarTileStatuses,
  getPolicyDetailFunctions, getPolicyPaymentsFunctions, installmentTableHeaders,
  policyFeesTableHeaders,
} from "@/pages/PolicyDetail/utils/policy_detail.tsx";
import Tabs from "@/components/Tabs/Tabs.tsx";

import Calendar from "@/components/Calendar/Calendar.tsx";
import { useEffect } from "react";
import PolicyFeeDeleteModal from "@/pages/PolicyDetail/components/PolicyFeeDeleteModal/PolicyFeeDeleteModal.tsx";
import { transactionsTableHeaders } from "@/pages/Transactions/utils/transactions.tsx";
import PolicyActivityModal from "@/pages/PolicyDetail/components/PolicyActivityModal/PolicyActivityModal.tsx";
import PaymentVoidModal from "@/pages/PolicyDetail/components/PaymentVoidModal/PaymentVoidModal.tsx";
import { getAuthFunctions } from "@/pages/Authorization/utils/auth.ts";
import Permission from "@/layout/Permission/Permission.tsx";

const PolicyDetailPage = () => {
  const { policyId } = useParams();

  const { user, fetchMyself } = getAuthFunctions();

  const {
    fetchPolicyById,
    policyById,
    policyDescriptionItems,
    calendarTileTypes,
    policyFeeSelection,
    updatePolicyFee,
    policyFeeDeletionButton,
    isPolicyFeeDeleteModalOpen,
    cancelPolicyFeeModal,

    installmentsTableItems,

    isPolicyActivityOpen, cancelPolicyActivity, openPolicyActivity
  } = getPolicyDetailFunctions(policyId);

  const {
    isPaymentVoidModalOpen,
    cancelPaymentVoidModal,
    openPaymentVoidModal,
    voidPayment,
    selectedPayment,
    paymentSelection,

    paymentsByPolicy, fetchPaymentsByPolicy,
  } = getPolicyPaymentsFunctions(policyId);

  useEffect(() => {
    fetchPolicyById();
    fetchPaymentsByPolicy();
    fetchMyself();
  }, []);

  const paymentTableActions = <div>
    {selectedPayment && <Permission permission='delete_payments' user_permission={user.permissions}>
        <Button variant='solid' onClick={openPaymentVoidModal} type='primary' color={'danger'}>Void payment</Button>
    </Permission>}
  </div>

  const tabs: TabsProps['items'] = [
    // {
    //   label: 'Vehicle information',
    //   key: 'policy_detail_fhv',
    //   children:
    //     <div className='policy_detail_page_body_vertical'>
    //       <div className='policy_detail_page_body_left'>
    //         <div className='policy_detail_page_body_left_fhv'>
    //           {/*<Table actions={<></>} columns={vehicleLicenseColumns} dataSource={vehicles}/>*/}
    //         </div>
    //       </div>
    //     </div>
    // },
    {
      label: 'Policy information',
      key: 'policy_detail_policy',
      children:
        <div className='policy_detail_page_body_horizontal'>
          <div className='policy_detail_page_body_vertical'>
            <div className='policy_detail_page_body_left'>
              <div className='policy_detail_page_body_left_policy'>
                <Description title="Policy information" layout="horizontal" column={1} bordered
                             items={policyDescriptionItems}/>
              </div>
            </div>
            <div className='policy_detail_page_body_right'>
              <div className='policy_detail_page_body_right_calendar_statuses'>
                {calendarTileStatuses.map(status => <div
                  className='policy_detail_page_body_right_calendar_statuses_item'>
                  <div className='policy_detail_page_body_right_calendar_statuses_item_color'
                       style={{ backgroundColor: status.color }}></div>
                  <p className='policy_detail_page_body_right_calendar_statuses_item_text'>{status.type}</p>
                </div>)}
              </div>
              <Calendar tileClassName={calendarTileTypes('due')}/>
            </div>
          </div>
          <div className='policy_detail_page_body_footer'>
            <div className='policy_detail_page_body_footer_table'>
              <Table actions={<div><Button variant='outlined' color='primary'>Add contact</Button></div>}
                     label='Contacts'
                     columns={policyFeesTableHeaders} dataSource={[]}/>
            </div>
          </div>
        </div>
    },
    {
      label: 'Settlements',
      key: 'policy_detail_settlements',
      children:
        <div className='policy_detail_page_body_horizontal'>
          <div className='policy_detail_page_body_left'>
            <Table label='Installments' dataSource={installmentsTableItems} columns={installmentTableHeaders}
                   summary={(data) => {
                     const [{ totalScheduledAmount, totalDueNowAmount, totalNetToCarrier }] = data;

                     return <AntTable.Summary.Row>
                       <AntTable.Summary.Cell index={1} colSpan={2} align='center'>Total</AntTable.Summary.Cell>
                       <AntTable.Summary.Cell index={2} colSpan={1}>{totalScheduledAmount}</AntTable.Summary.Cell>
                       <AntTable.Summary.Cell index={3} colSpan={1}>{totalDueNowAmount}</AntTable.Summary.Cell>
                       <AntTable.Summary.Cell index={3} colSpan={1}>{totalNetToCarrier}</AntTable.Summary.Cell>
                     </AntTable.Summary.Row>
                   }}
                   pagination={false}
                   size={'small'}
                   actions={<></>}/>
          </div>
          <div className='policy_detail_page_body_right'>
            <div className='policy_detail_page_body_right_payments'>
              <Table actions={paymentTableActions}
                     label='Paid payments'
                     rowClassName={(record) =>
                       record.isDeleted ? 'policy_detail_page_body_right_payments_row_void' : ''
                     }
                     rowSelection={paymentSelection}
                     rowKey='_id'
                     columns={transactionsTableHeaders} dataSource={paymentsByPolicy}/>
            </div>
          </div>
        </div>
    },
    {
      label: 'Policy Fees',
      key: 'policy_detail_fees',
      children:
        <div className='policy_detail_page_body_vertical'>
          <div className='policy_detail_page_body_left'>
            <div className='policy_detail_page_body_left_fees'>
              <Table actions={policyFeeDeletionButton}
                     label='Policy fees'
                     rowKey='_id'
                     columns={policyFeesTableHeaders} dataSource={policyById.fees} rowSelection={policyFeeSelection}/>
            </div>
          </div>
          <div className='policy_detail_page_body_right'>
            <div className='policy_detail_page_body_right_calendar_statuses'>
              {calendarTileStatuses.map(status => <div className='policy_detail_page_body_right_calendar_statuses_item'>
                <div className='policy_detail_page_body_right_calendar_statuses_item_color'
                     style={{ backgroundColor: status.color }}></div>
                <p className='policy_detail_page_body_right_calendar_statuses_item_text'>{status.type}</p>
              </div>)}
            </div>
            <Calendar tileClassName={calendarTileTypes('fee')}/>
          </div>
        </div>
    }
  ]

  return <Page showSearch={false} fixedHeader>
    <div className='policy_detail_page'>
      <div className='policy_detail_page_top'>
        <h4>Detail information of Policy No. {policyById.policyNumber}</h4>
        <div className='policy_detail_page_top_actions'>
          <Button variant='solid' color='orange' icon={<ClockCircleOutlined/>} onClick={openPolicyActivity}>Show
            activity</Button>
          {/*<Button variant='solid' color='primary'>Show policy ledger</Button>*/}
          {/*<Button>Delete policy</Button>*/}
          {/*<Button>Edit policy</Button>*/}
        </div>
      </div>
      <div className='policy_detail_page_body'>
        <Tabs
          defaultActiveKey="policy_detail_policy"
          tabPosition={'top'}
          type='card'
          items={tabs}
        />
      </div>
    </div>
    <PolicyFeeDeleteModal open={isPolicyFeeDeleteModalOpen} cancel={cancelPolicyFeeModal} submit={updatePolicyFee}/>
    <PolicyActivityModal open={isPolicyActivityOpen} cancel={cancelPolicyActivity} policyId={policyId}
                         policy={policyById}/>
    <PaymentVoidModal open={isPaymentVoidModalOpen} submit={voidPayment} cancel={cancelPaymentVoidModal}/>
  </Page>
}

export default PolicyDetailPage;
