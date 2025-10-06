import './InvitationPage.scss';
import Input from "@/components/Input/Input.tsx";
import PasswordInput from "@/components/PasswordInput/PasswordInput.tsx";
import Button from "@/components/Button/Button.tsx";
import { useParams } from "react-router";
import { getInvitationFunction } from "@/pages/Invitation/utils/invitation.ts";

const InvitationPage = () => {
  const { invitationToken } = useParams();

  const { invitationForm, changeInput, submit, loading } = getInvitationFunction(invitationToken);

  return <div className='invitation_page'>
    <div className='invitation_page_container'>
      <label className='invitation_page_container_title'>TLCify.com</label>
      <div className='invitation_page_container_horizontal'>
        <Input label='First Name' value={invitationForm.firstName} onChange={changeInput('firstName')}/>
        <Input label='Last Name' value={invitationForm.lastName} onChange={changeInput('lastName')}/>
      </div>
      <PasswordInput label='New password' value={invitationForm.password} onChange={changeInput('password')}/>
      <PasswordInput label='Confirm password' value={invitationForm.confirmPassword}
                     onChange={changeInput('confirmPassword')}/>
      <div className='invitation_page_container_footer'>
        <Button variant='solid' type='primary' color='blue' onClick={submit} loading={loading}>Submit</Button>
      </div>
    </div>
  </div>
}

export default InvitationPage;
