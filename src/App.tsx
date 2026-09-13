/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { PricingPage } from './components/PricingPage';
import { DataForm } from './components/DataForm';
import { PreviewPlaceholder } from './components/PreviewPlaceholder';
import { SelectedPackageType, SubmissionPayload } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'pricing' | 'form' | 'preview'>('landing');
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackageType>('cv');
  const [latestSubmission, setLatestSubmission] = useState<SubmissionPayload | null>(null);

  const handleSelectPackage = (pkgName: string) => {
    console.log(`[CVPintar ID] Paket dipilih:`, pkgName);
    if (pkgName.toLowerCase().includes('surat lamaran')) {
      setSelectedPackage('surat_lamaran');
    } else {
      setSelectedPackage('cv');
    }
    setCurrentPage('form');
  };

  const handleSubmitSuccess = (submission: SubmissionPayload) => {
    setLatestSubmission(submission);
    setCurrentPage('preview');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {currentPage === 'landing' && (
        <LandingPage onNavigateToPricing={() => setCurrentPage('pricing')} />
      )}

      {currentPage === 'pricing' && (
        <PricingPage
          onBack={() => setCurrentPage('landing')}
          onSelectPackage={handleSelectPackage}
        />
      )}

      {currentPage === 'form' && (
        <DataForm
          selectedPackage={selectedPackage}
          onBackToPricing={() => setCurrentPage('pricing')}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}

      {currentPage === 'preview' && latestSubmission && (
        <PreviewPlaceholder
          submission={latestSubmission}
          onReset={() => setCurrentPage('landing')}
          onBackToEdit={() => setCurrentPage('form')}
        />
      )}
    </div>
  );
}

