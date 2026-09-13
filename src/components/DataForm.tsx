import React from 'react';
import { CvForm } from './CvForm';
import { CoverLetterForm } from './CoverLetterForm';
import { SelectedPackageType, SubmissionPayload } from '../types';

interface DataFormProps {
  selectedPackage: SelectedPackageType;
  onBackToPricing: () => void;
  onSubmitSuccess: (submission: SubmissionPayload) => void;
}

export const DataForm: React.FC<DataFormProps> = ({
  selectedPackage,
  onBackToPricing,
  onSubmitSuccess,
}) => {
  if (selectedPackage === 'cv') {
    return (
      <CvForm
        onBackToPricing={onBackToPricing}
        onSubmitSuccess={onSubmitSuccess}
      />
    );
  }

  return (
    <CoverLetterForm
      onBackToPricing={onBackToPricing}
      onSubmitSuccess={onSubmitSuccess}
    />
  );
};
