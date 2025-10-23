import React from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CButton,
} from "@coreui/react";

function Password() {
  return (
    <CCard className="mb-6 shadow-sm">
      <CCardHeader className="font-semibold">Password Management</CCardHeader>
      <CCardBody>
        <CForm className="grid gap-4 mb-6">
          <CFormSelect label="Select User" options={["Select User", "john@store.com", "mary@store.com"]} />
          <CFormInput type="password" label="New Password" placeholder="Enter new password" />
          <CFormCheck label="Force password change on next login" />
          <CButton color="primary">Reset Password</CButton>
        </CForm>

        <h2 className="text-lg font-semibold mb-3">Password Policy</h2>
        <ul className="list-disc pl-6 text-sm text-gray-600">
          <li>Minimum 8 characters</li>
          <li>At least 1 uppercase, 1 number, 1 special character</li>
          <li>Password expires every 90 days</li>
        </ul>
      </CCardBody>
    </CCard>
  );
}

export default Password;
