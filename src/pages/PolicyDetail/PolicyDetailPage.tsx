import './PolicyDetailPage.scss';

import Page from "@/layout/Page/Page.tsx";
import Button from "@/components/Button/Button.tsx";
import { ClockCircleOutlined } from "@ant-design/icons";

import Description from "@/components/Description/Description.tsx";
import type { TabsProps } from "antd";
import { useNavigate, useParams } from "react-router";
import Table from "@/components/Table/Table.tsx";
import {
  calendarTileStatuses,
  getPolicyDetailFunctions,
  policyFeesTableHeaders, vehicleLicenseColumns
} from "@/pages/PolicyDetail/utils/policy_detail.tsx";
import Tabs from "@/components/Tabs/Tabs.tsx";

import Calendar from "@/components/Calendar/Calendar.tsx";
import { useEffect } from "react";
import PolicyFeeDeleteModal from "@/pages/PolicyDetail/components/PolicyFeeDeleteModal/PolicyFeeDeleteModal.tsx";
import { transactionsTableHeaders } from "@/pages/Transactions/utils/transactions.tsx";

const PolicyDetailPage = () => {
  const navigate = useNavigate();

  const { policyId } = useParams();

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

    paymentsByPolicy, fetchPaymentsByPolicy,

    installmentsDescriptionItems,
  } = getPolicyDetailFunctions(policyId);

  useEffect(() => {
    fetchPolicyById();
    fetchPaymentsByPolicy();
  }, []);

  const tabs: TabsProps['items'] = [
    {
      label: 'Vehicle information',
      key: 'policy_detail_fhv',
      children:
        <div className='policy_detail_page_body_vertical'>
          <div className='policy_detail_page_body_left'>
            <div className='policy_detail_page_body_left_fhv'>
              {/*<Table actions={<></>} columns={vehicleLicenseColumns} dataSource={vehicles}/>*/}
            </div>
          </div>
        </div>
    },
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
            <Description title="Installments" layout="horizontal" className='policy_detail_page_body_left_installments'
                         size='small' column={1} bordered
                         items={installmentsDescriptionItems}/>
          </div>
          <div className='policy_detail_page_body_right'>
            <div className='policy_detail_page_body_right_payments'>
              <Table actions={<></>}
                     label='Paid payments'
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

  return <Page showSearch={false} fixedHeader back={() => navigate(-1)}>
    <div className='policy_detail_page'>
      <div className='policy_detail_page_top'>
        <h4>Detail information of Policy No. {policyById.policyNumber}</h4>
        <div className='policy_detail_page_top_actions'>
          <Button variant='solid' color='orange' icon={<ClockCircleOutlined/>}>Show activity</Button>
          <Button variant='solid' color='primary'>Show policy ledger</Button>
          {/*<Button>Delete policy</Button>*/}
          {/*<Button>Edit policy</Button>*/}
        </div>
      </div>
      <div className='policy_detail_page_body'>
        <Tabs
          defaultActiveKey="policy_detail_client"
          tabPosition={'top'}
          type='card'
          items={tabs}
        />
      </div>
    </div>
    <PolicyFeeDeleteModal open={isPolicyFeeDeleteModalOpen} cancel={cancelPolicyFeeModal} submit={updatePolicyFee}/>
  </Page>
}

export default PolicyDetailPage;
