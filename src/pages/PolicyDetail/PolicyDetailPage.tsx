import './PolicyDetailPage.scss';

import Page from "@/layout/Page/Page.tsx";
import Button from "@/components/Button/Button.tsx";
import { ClockCircleOutlined } from "@ant-design/icons";

import Card from "@/components/Card/Card.tsx";

import AvatarImage from '@/assets/images/ali.jpeg';
import { PhoneTwoTone, MailTwoTone, IdcardTwoTone, HomeTwoTone } from '@ant-design/icons';
import Description from "@/components/Description/Description.tsx";
import type { TabsProps } from "antd";
import { useNavigate, useParams } from "react-router";
import Table from "@/components/Table/Table.tsx";
import {
  calendarTileStatuses,
  getPolicyDetailFunctions,
  policyDetailActions,
  policyFeesTableHeaders
} from "@/pages/PolicyDetail/utils/policy_detail.tsx";
import Tabs from "@/components/Tabs/Tabs.tsx";

import Calendar from "@/components/Calendar/Calendar.tsx";
import { useEffect } from "react";
import PolicyFeeDeleteModal from "@/pages/PolicyDetail/components/PolicyFeeDeleteModal/PolicyFeeDeleteModal.tsx";

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
    cancelPolicyFeeModal
  } = getPolicyDetailFunctions(policyId);

  useEffect(() => {
    fetchPolicyById();
  }, []);

  const tabs: TabsProps['items'] = [
    {
      label: 'Client information',
      key: 'policy_detail_client',
      children:
        <div className='policy_detail_page_body_tab'>
          <div className='policy_detail_page_body_left'>
            <div className='policy_detail_page_body_left_client'>
              <Card variant={'borderless'} title={'Customer information'}
                    className='policy_detail_page_body_left_client_card' loading={false} actions={policyDetailActions}
                    style={{ minWidth: 300 }}
                    avatarProps={{
                      avatar: <img src={AvatarImage} className='policy_detail_page_body_left_client_card_avatar'/>,
                      title: 'Margellan Amangeldin',
                      description: <div className='policy_detail_page_body_left_client_card_description'>
                        <div className='policy_detail_page_body_left_client_card_description_item'>
                          <PhoneTwoTone/>
                          <p>{policyById.customer.phoneNumber}</p>
                        </div>
                        <div className='policy_detail_page_body_left_client_card_description_item'>
                          <MailTwoTone/>
                          <p>{policyById.customer.email}</p>
                        </div>
                        <div className='policy_detail_page_body_left_client_card_description_item'>
                          <IdcardTwoTone/>
                          <p>{policyById.customer.dateOfBirth}</p>
                        </div>
                        <div className='policy_detail_page_body_left_client_card_description_item'>
                          <HomeTwoTone/>
                          <p>{policyById.customer.address}</p>
                        </div>
                      </div>
                    }}/>
              {/*// TODO Do i need to add TLC detail?*/}
            </div>
          </div>
          <div className='policy_detail_page_body_right'>

          </div>
        </div>
    },
    {
      label: 'Policy information',
      key: 'policy_detail_policy',
      children:
        <div className='policy_detail_page_body_tab'>
          <div className='policy_detail_page_body_left'>
            <div className='policy_detail_page_body_left_policy'>
              <Description title="Policy information" layout="vertical" bordered items={policyDescriptionItems}/>
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
            <Calendar tileClassName={calendarTileTypes('due')}/>
          </div>
        </div>
    },
    {
      label: 'Policy Fees',
      key: 'policy_detail_fees',
      children:
        <div className='policy_detail_page_body_tab'>
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
      <div className='policy_detail_page_footer'>
        <div className='policy_detail_page_footer_table'>
          <Table actions={<div><Button variant='outlined' color='primary'>Add contact</Button></div>} label='Contacts'
                 columns={policyFeesTableHeaders} dataSource={[]}/>
        </div>
      </div>
    </div>
    <PolicyFeeDeleteModal open={isPolicyFeeDeleteModalOpen} cancel={cancelPolicyFeeModal} submit={updatePolicyFee}/>
  </Page>
}

export default PolicyDetailPage;
