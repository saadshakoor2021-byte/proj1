import React, { useCallback, useState } from 'react';
import { useApp } from '../context';
import { emptyProfile, saveProfile } from '../lib/storage';
import { Button, Input } from '../ui';

interface ApplicantInfo {
  citizenship: string;
  residence: string;
  educationCountry: string;
  qualification: string;
  graduationYear: string;
  entryYear: string;
  category?: string;
}

interface AcademicInfo {
  board: string;
  qualificationType: string;
  matricMarks: number;
  matricTotal: number;
  intermediateMarks: number;
  intermediateTotal: number;
}

interface AcademicGoals {
  degreeLevel: string;
  major: string;
  alternativeMajors: string[];
  preferredDestinations: string;
  preferredCities: string;
  teachingLanguage: string;
  uniType: string;
  intake: string;
}

interface FinancialInfo {
  annualTuitionBudget: number;
  annualTotalBudget: number;
  degreeBudget?: number;
  budgetCurrency: string;
  includeAccommodation: boolean;
  needScholarships: boolean;
  needFullFunding: boolean;
  familyFundingAvailable: boolean;
}

interface TestsAndDocs {
  sat: boolean;
  ielts: boolean;
  toefl: boolean;
  otherTests: string[];
  transcriptAvailable: boolean;
  certificateAvailable: boolean;
  recLetters: boolean;
  personalStatement: boolean;
  passportAvailable: boolean;
  proofOfFunds: boolean;
  qualEquivalency: boolean;
  otherDocs: string;
}

export function Onboarding() {
  const { navigate } = useApp();
  const [step, setStep] = useState(1);
  const [applicantInfo, setApplicantInfo] = useState<ApplicantInfo>({
    citizenship: '',
    residence: '',
    educationCountry: '',
    qualification: '',
    graduationYear: '',
    entryYear: '',
  });
  const [academicInfo, setAcademicInfo] = useState<AcademicInfo>({
    board: '',
    qualificationType: '',
    matricMarks: 0,
    matricTotal: 0,
    intermediateMarks: 0,
    intermediateTotal: 0,
  });
  const [academicGoals, setAcademicGoals] = useState<AcademicGoals>({
    degreeLevel: '',
    major: '',
    alternativeMajors: [],
    preferredDestinations: '',
    preferredCities: '',
    teachingLanguage: '',
    uniType: '',
    intake: '',
  });
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
    annualTuitionBudget: 0,
    annualTotalBudget: 0,
    budgetCurrency: 'PKR',
    includeAccommodation: false,
    needScholarships: false,
    needFullFunding: false,
    familyFundingAvailable: false,
  });
  const [testsAndDocs, setTestsAndDocs] = useState<TestsAndDocs>({
    sat: false,
    ielts: false,
    toefl: false,
    otherTests: [],
    transcriptAvailable: false,
    certificateAvailable: false,
    recLetters: false,
    personalStatement: false,
    passportAvailable: false,
    proofOfFunds: false,
    qualEquivalency: false,
    otherDocs: '',
  });

  const handleApplicantChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setApplicantInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAcademicChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAcademicInfo((prev) => {
      if (name === 'matricMarks' || name === 'matricTotal' || name === 'intermediateMarks' || name === 'intermediateTotal') {
        return { ...prev, [name]: Number.parseInt(value, 10) || 0 };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const handleGoalsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAcademicGoals((prev) => {
      if (name === 'alternativeMajors') {
        return { ...prev, alternativeMajors: value.split(',').map((item) => item.trim()).filter(Boolean) };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const handleFinancialChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFinancialInfo((prev) => {
      if (type === 'checkbox') return { ...prev, [name]: checked };
      if (name === 'annualTuitionBudget' || name === 'annualTotalBudget' || name === 'degreeBudget') {
        return { ...prev, [name]: Number.parseInt(value, 10) || 0 };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const handleTestsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;
    setTestsAndDocs((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const percentage = (() => {
    if (academicInfo.matricTotal > 0 && academicInfo.intermediateTotal > 0) {
      const matricPct = (academicInfo.matricMarks / academicInfo.matricTotal) * 100;
      const intermediatePct = (academicInfo.intermediateMarks / academicInfo.intermediateTotal) * 100;
      return ((matricPct + intermediatePct) / 2).toFixed(1);
    }
    return undefined;
  })();

  const nextStep = () => setStep((current) => Math.min(6, current + 1));
  const prevStep = () => setStep((current) => Math.max(1, current - 1));

  const confirmProfile = () => {
    saveProfile({
      ...emptyProfile(),
      citizenship: applicantInfo.citizenship,
      residence: applicantInfo.residence,
      educationCountry: applicantInfo.educationCountry,
      qualification: applicantInfo.qualification || academicInfo.qualificationType,
      percentage: percentage || '',
      intendedMajor: academicGoals.major,
      budget: financialInfo.annualTotalBudget ? String(financialInfo.annualTotalBudget) : '',
      budgetCurrency: financialInfo.budgetCurrency,
      preferredDestinations: academicGoals.preferredDestinations,
      sat: testsAndDocs.sat,
      ielts: testsAndDocs.ielts,
      toefl: testsAndDocs.toefl,
    });
    navigate('universities', {
      country: academicGoals.preferredDestinations.split(',')[0]?.trim() || 'all',
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex justify-between gap-2">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className={`h-2 flex-1 rounded-full ${num <= step ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </div>
      <div className="mb-8 border-b border-border pb-2 text-xs font-medium text-muted-foreground">
        Step {step} of 6
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        {step === 1 && <ApplicantStep info={applicantInfo} onChange={handleApplicantChange} />}
        {step === 2 && <AcademicStep info={academicInfo} onChange={handleAcademicChange} percentage={percentage} />}
        {step === 3 && <GoalsStep info={academicGoals} onChange={handleGoalsChange} />}
        {step === 4 && <FinancialStep info={financialInfo} onChange={handleFinancialChange} />}
        {step === 5 && (
          <TestsStep
            info={testsAndDocs}
            onChange={handleTestsChange}
            onChangeOther={(event) =>
              setTestsAndDocs((prev) => ({
                ...prev,
                otherTests: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean),
              }))
            }
          />
        )}
        {step === 6 && (
          <ReviewStep
            applicantInfo={applicantInfo}
            academicInfo={academicInfo}
            academicGoals={academicGoals}
            financialInfo={financialInfo}
            testsAndDocs={testsAndDocs}
          />
        )}
      </div>

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
        ) : (
          <span />
        )}
        {step < 6 ? (
          <Button variant="primary" onClick={nextStep}>
            Continue
          </Button>
        ) : (
          <Button variant="primary" onClick={confirmProfile}>
            Find My Matches
          </Button>
        )}
      </div>
    </div>
  );
}

function ApplicantStep({ info, onChange }: { info: ApplicantInfo; onChange: React.ChangeEventHandler<HTMLInputElement> }) {
  return (
    <div className="space-y-4">
      <h3 className="mb-4 font-semibold">Applicant information</h3>
      <Field label="Country of citizenship" name="citizenship" value={info.citizenship} onChange={onChange} placeholder="e.g., Pakistan" />
      <Field label="Current country of residence" name="residence" value={info.residence} onChange={onChange} placeholder="e.g., Pakistan" />
      <Field label="Country where secondary education was completed" name="educationCountry" value={info.educationCountry} onChange={onChange} placeholder="e.g., Pakistan" />
      <Field label="Qualification type" name="qualification" value={info.qualification} onChange={onChange} placeholder="e.g., FSc Pre-Engineering" />
      <Field label="Graduation year" name="graduationYear" value={info.graduationYear} onChange={onChange} placeholder="e.g., 2024" />
      <Field label="Intended university-entry year" name="entryYear" value={info.entryYear} onChange={onChange} placeholder="e.g., 2025" />
      {info.citizenship === 'Pakistan' && (
        <Field label="Applicant category (optional)" name="category" value={info.category || ''} onChange={onChange} placeholder="e.g., FBISE" />
      )}
    </div>
  );
}

function AcademicStep({
  info,
  onChange,
  percentage,
}: {
  info: AcademicInfo;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  percentage?: string;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Academic information</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Board" name="board" value={info.board} onChange={onChange} placeholder="e.g., FBISE" />
        <Field label="Qualification type" name="qualificationType" value={info.qualificationType} onChange={onChange} placeholder="e.g., FSc Pre-Engineering" />
        <Field label="Matric marks obtained" name="matricMarks" value={info.matricMarks || ''} onChange={onChange} placeholder="e.g., 920" />
        <Field label="Matric total marks" name="matricTotal" value={info.matricTotal || ''} onChange={onChange} placeholder="e.g., 1100" />
        <Field label="Intermediate marks obtained" name="intermediateMarks" value={info.intermediateMarks || ''} onChange={onChange} placeholder="e.g., 880" />
        <Field label="Intermediate total marks" name="intermediateTotal" value={info.intermediateTotal || ''} onChange={onChange} placeholder="e.g., 1100" />
      </div>
      {percentage !== undefined && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="font-medium">{percentage}% average</p>
          <p className="mt-1 text-xs text-primary">Calculated from your marks</p>
        </div>
      )}
    </div>
  );
}

function GoalsStep({ info, onChange }: { info: AcademicGoals; onChange: React.ChangeEventHandler<HTMLInputElement> }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Academic goals</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Degree level" name="degreeLevel" value={info.degreeLevel} onChange={onChange} placeholder="e.g., Bachelor's" />
        <Field label="Intended major" name="major" value={info.major} onChange={onChange} placeholder="e.g., Computer Science" />
        <Field label="Alternative majors" name="alternativeMajors" value={info.alternativeMajors.join(', ')} onChange={onChange} placeholder="e.g., Software Engineering, Mathematics" />
        <Field label="Preferred destinations" name="preferredDestinations" value={info.preferredDestinations} onChange={onChange} placeholder="e.g., Pakistan, Saudi Arabia, Italy" />
        <Field label="Preferred cities" name="preferredCities" value={info.preferredCities} onChange={onChange} placeholder="e.g., Lahore, Karachi" />
        <Field label="Teaching language" name="teachingLanguage" value={info.teachingLanguage} onChange={onChange} placeholder="e.g., English" />
        <Field label="Public or private university preference" name="uniType" value={info.uniType} onChange={onChange} placeholder="e.g., Public" />
        <Field label="Intake" name="intake" value={info.intake} onChange={onChange} placeholder="e.g., Fall" />
      </div>
    </div>
  );
}

function FinancialStep({ info, onChange }: { info: FinancialInfo; onChange: React.ChangeEventHandler<HTMLInputElement> }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Financial information</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Annual tuition budget" name="annualTuitionBudget" value={info.annualTuitionBudget || ''} onChange={onChange} placeholder="e.g., 1500000" />
        <Field label="Annual total education budget" name="annualTotalBudget" value={info.annualTotalBudget || ''} onChange={onChange} placeholder="e.g., 1500000" />
        <Field label="Degree budget (optional)" name="degreeBudget" value={info.degreeBudget || ''} onChange={onChange} placeholder="e.g., 5000000" />
        <Field label="Budget currency" name="budgetCurrency" value={info.budgetCurrency} onChange={onChange} placeholder="e.g., PKR" />
        <CheckboxField label="Accommodation included" name="includeAccommodation" checked={info.includeAccommodation} onChange={onChange} />
        <CheckboxField label="Scholarships needed" name="needScholarships" checked={info.needScholarships} onChange={onChange} />
        <CheckboxField label="Full funding necessary" name="needFullFunding" checked={info.needFullFunding} onChange={onChange} />
        <CheckboxField label="Family funding available" name="familyFundingAvailable" checked={info.familyFundingAvailable} onChange={onChange} />
      </div>
    </div>
  );
}

function TestsStep({
  info,
  onChange,
  onChangeOther,
}: {
  info: TestsAndDocs;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onChangeOther: React.ChangeEventHandler<HTMLTextAreaElement>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Tests and documents</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CheckboxField label="SAT" name="sat" checked={info.sat} onChange={onChange} />
        <CheckboxField label="IELTS" name="ielts" checked={info.ielts} onChange={onChange} />
        <CheckboxField label="TOEFL" name="toefl" checked={info.toefl} onChange={onChange} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Other admission tests</label>
        <textarea
          name="otherTests"
          rows={3}
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onChange={onChangeOther}
          placeholder="SAT Subject Tests, etc."
          defaultValue={info.otherTests.join('\n')}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CheckboxField label="Transcript available" name="transcriptAvailable" checked={info.transcriptAvailable} onChange={onChange} />
        <CheckboxField label="Certificate available" name="certificateAvailable" checked={info.certificateAvailable} onChange={onChange} />
        <CheckboxField label="Recommendation letters" name="recLetters" checked={info.recLetters} onChange={onChange} />
        <CheckboxField label="Personal statement or essays" name="personalStatement" checked={info.personalStatement} onChange={onChange} />
        <CheckboxField label="Passport availability" name="passportAvailable" checked={info.passportAvailable} onChange={onChange} />
        <CheckboxField label="Proof of funds" name="proofOfFunds" checked={info.proofOfFunds} onChange={onChange} />
        <CheckboxField label="Qualification equivalency" name="qualEquivalency" checked={info.qualEquivalency} onChange={onChange} />
        <Field label="Other program-specific documents" name="otherDocs" value={info.otherDocs} onChange={onChange} placeholder="e.g., Portfolio, Interview" />
      </div>
    </div>
  );
}

function ReviewStep({
  applicantInfo,
  academicInfo,
  academicGoals,
  financialInfo,
  testsAndDocs,
}: {
  applicantInfo: ApplicantInfo;
  academicInfo: AcademicInfo;
  academicGoals: AcademicGoals;
  financialInfo: FinancialInfo;
  testsAndDocs: TestsAndDocs;
}) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold">Review your profile</h3>
      <div>
        <h4 className="font-medium">Applicant information</h4>
        <p className="text-sm text-muted-foreground">Citizenship: {applicantInfo.citizenship || 'Not specified'}</p>
        <p className="text-sm text-muted-foreground">Residence: {applicantInfo.residence || 'Not specified'}</p>
        <p className="text-sm text-muted-foreground">Education country: {applicantInfo.educationCountry || 'Not specified'}</p>
        <p className="text-sm text-muted-foreground">Qualification: {applicantInfo.qualification || 'Not specified'}</p>
      </div>
      <div>
        <h4 className="font-medium">Academic information</h4>
        <p className="text-sm text-muted-foreground">Board: {academicInfo.board || 'Not specified'}</p>
        <p className="text-sm text-muted-foreground">Qualification: {academicInfo.qualificationType || 'Not specified'}</p>
        <p className="text-sm text-muted-foreground">Marks: {academicInfo.matricMarks}/{academicInfo.matricTotal}</p>
      </div>
      <div>
        <h4 className="font-medium">Academic goals</h4>
        <p className="text-sm text-muted-foreground">Degree: {academicGoals.degreeLevel || 'Not specified'}</p>
        <p className="text-sm text-muted-foreground">Major: {academicGoals.major || 'Not specified'}</p>
        <p className="text-sm text-muted-foreground">Destinations: {academicGoals.preferredDestinations || 'Not specified'}</p>
      </div>
      <div>
        <h4 className="font-medium">Financial information</h4>
        <p className="text-sm text-muted-foreground">Annual tuition budget: {financialInfo.budgetCurrency} {financialInfo.annualTuitionBudget}</p>
        <p className="text-sm text-muted-foreground">Annual total budget: {financialInfo.budgetCurrency} {financialInfo.annualTotalBudget}</p>
      </div>
      <div>
        <h4 className="font-medium">Tests and documents</h4>
        <p className="text-sm text-muted-foreground">SAT: {testsAndDocs.sat ? 'Yes' : 'No'}</p>
        <p className="text-sm text-muted-foreground">IELTS: {testsAndDocs.ielts ? 'Yes' : 'No'}</p>
        <p className="text-sm text-muted-foreground">TOEFL: {testsAndDocs.toefl ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <Input {...props} />
    </div>
  );
}

function CheckboxField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <Input type="checkbox" {...props} />
      {label}
    </label>
  );
}

export default Onboarding;
