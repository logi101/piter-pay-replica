"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  Wallet,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Baby,
  Briefcase,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  HouseholdSetupStep1Data,
  HouseholdSetupStep2Data,
  HouseholdSetupStep3Data,
  HousingType,
  EmploymentType,
} from "@/types";

// Step configuration
const steps = [
  { id: 1, title: "פרטים בסיסיים", icon: Home },
  { id: 2, title: "בני משפחה", icon: Users },
  { id: 3, title: "מצב כלכלי", icon: Wallet },
  { id: 4, title: "סיום", icon: CheckCircle },
];

// Housing types
const housingTypes: { id: HousingType; label: string }[] = [
  { id: "owner", label: "בעלות" },
  { id: "renter", label: "שכירות" },
  { id: "with_parents", label: "עם הורים" },
  { id: "other", label: "אחר" },
];

// Employment types
const employmentTypes: { id: EmploymentType; label: string }[] = [
  { id: "employed", label: "שכיר" },
  { id: "self_employed", label: "עצמאי" },
  { id: "unemployed", label: "לא עובד" },
  { id: "retired", label: "פנסיונר" },
  { id: "student", label: "סטודנט" },
];

export default function HouseholdSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1 data
  const [step1Data, setStep1Data] = useState<HouseholdSetupStep1Data>({
    householdName: "",
    primaryEmail: "",
    phone: "",
  });

  // Step 2 data
  const [step2Data, setStep2Data] = useState<HouseholdSetupStep2Data>({
    hasSpouse: false,
    spouseName: "",
    spouseIncome: 0,
    childrenCount: 0,
    childrenAges: [],
  });

  // Step 3 data
  const [step3Data, setStep3Data] = useState<HouseholdSetupStep3Data>({
    housingType: "renter",
    monthlyHousingCost: 0,
    primaryEmployment: "employed",
    totalMonthlyIncome: 0,
  });

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return step1Data.householdName.length >= 2 && step1Data.primaryEmail.includes("@");
      case 2:
        return true; // Optional data
      case 3:
        return step3Data.totalMonthlyIncome > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);

    // Here you would call householdService.completeSetup
    // For now, simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleChildrenCountChange = (count: number) => {
    const newAges = [...step2Data.childrenAges];
    if (count > newAges.length) {
      // Add empty ages
      while (newAges.length < count) {
        newAges.push(0);
      }
    } else {
      // Remove extra ages
      newAges.splice(count);
    }
    setStep2Data({ ...step2Data, childrenCount: count, childrenAges: newAges });
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const newAges = [...step2Data.childrenAges];
    newAges[index] = age;
    setStep2Data({ ...step2Data, childrenAges: newAges });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            ברוכים הבאים ל-PiterPay
          </h1>
          <p className="text-slate-500">
            בואו נגדיר את משק הבית שלכם ב-4 שלבים פשוטים
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 -z-10" />
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isCurrent
                      ? "bg-white border-emerald-500 text-emerald-500"
                      : "bg-white border-slate-200 text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2",
                    isCurrent ? "text-emerald-600 font-medium" : "text-slate-400"
                  )}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Home className="w-4 h-4" />
                    שם משק הבית
                  </label>
                  <Input
                    placeholder="לדוגמה: משפחת כהן"
                    value={step1Data.householdName}
                    onChange={(e) =>
                      setStep1Data({ ...step1Data, householdName: e.target.value })
                    }
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Mail className="w-4 h-4" />
                    אימייל ראשי
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={step1Data.primaryEmail}
                    onChange={(e) =>
                      setStep1Data({ ...step1Data, primaryEmail: e.target.value })
                    }
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Phone className="w-4 h-4" />
                    טלפון (אופציונלי)
                  </label>
                  <Input
                    type="tel"
                    placeholder="050-0000000"
                    value={step1Data.phone}
                    onChange={(e) =>
                      setStep1Data({ ...step1Data, phone: e.target.value })
                    }
                    className="text-right"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Family Members */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Users className="w-4 h-4" />
                    האם יש בן/בת זוג?
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep2Data({ ...step2Data, hasSpouse: true })}
                      className={cn(
                        "flex-1 py-3 rounded-lg border-2 transition-all",
                        step2Data.hasSpouse
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      כן
                    </button>
                    <button
                      onClick={() =>
                        setStep2Data({
                          ...step2Data,
                          hasSpouse: false,
                          spouseName: "",
                          spouseIncome: 0,
                        })
                      }
                      className={cn(
                        "flex-1 py-3 rounded-lg border-2 transition-all",
                        !step2Data.hasSpouse
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      לא
                    </button>
                  </div>
                </div>

                {step2Data.hasSpouse && (
                  <>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <User className="w-4 h-4" />
                        שם בן/בת הזוג
                      </label>
                      <Input
                        placeholder="שם"
                        value={step2Data.spouseName}
                        onChange={(e) =>
                          setStep2Data({ ...step2Data, spouseName: e.target.value })
                        }
                        className="text-right"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Wallet className="w-4 h-4" />
                        הכנסה חודשית של בן/בת הזוג (₪)
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={step2Data.spouseIncome || ""}
                        onChange={(e) =>
                          setStep2Data({
                            ...step2Data,
                            spouseIncome: Number(e.target.value),
                          })
                        }
                        className="text-right"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Baby className="w-4 h-4" />
                    מספר ילדים
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    placeholder="0"
                    value={step2Data.childrenCount || ""}
                    onChange={(e) => handleChildrenCountChange(Number(e.target.value))}
                    className="text-right"
                  />
                </div>

                {step2Data.childrenCount > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      גילאי הילדים
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {step2Data.childrenAges.map((age, index) => (
                        <Input
                          key={index}
                          type="number"
                          min="0"
                          max="120"
                          placeholder={`ילד ${index + 1}`}
                          value={age || ""}
                          onChange={(e) =>
                            handleChildAgeChange(index, Number(e.target.value))
                          }
                          className="text-center"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Financial Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Briefcase className="w-4 h-4" />
                    סוג תעסוקה
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {employmentTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() =>
                          setStep3Data({ ...step3Data, primaryEmployment: type.id })
                        }
                        className={cn(
                          "py-2 px-3 rounded-lg border text-sm transition-all",
                          step3Data.primaryEmployment === type.id
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Wallet className="w-4 h-4" />
                    סה&quot;כ הכנסה חודשית (כולל בן/בת זוג)
                  </label>
                  <Input
                    type="number"
                    placeholder="לדוגמה: 20000"
                    value={step3Data.totalMonthlyIncome || ""}
                    onChange={(e) =>
                      setStep3Data({
                        ...step3Data,
                        totalMonthlyIncome: Number(e.target.value),
                      })
                    }
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Building className="w-4 h-4" />
                    סוג מגורים
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {housingTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() =>
                          setStep3Data({ ...step3Data, housingType: type.id })
                        }
                        className={cn(
                          "py-3 px-4 rounded-lg border text-sm transition-all",
                          step3Data.housingType === type.id
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Home className="w-4 h-4" />
                    עלות דיור חודשית (שכירות/משכנתא)
                  </label>
                  <Input
                    type="number"
                    placeholder="לדוגמה: 5000"
                    value={step3Data.monthlyHousingCost || ""}
                    onChange={(e) =>
                      setStep3Data({
                        ...step3Data,
                        monthlyHousingCost: Number(e.target.value),
                      })
                    }
                    className="text-right"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Completion */}
            {currentStep === 4 && (
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    מעולה! סיימנו להגדיר את משק הבית
                  </h2>
                  <p className="text-slate-500">
                    הפרופיל של &quot;{step1Data.householdName}&quot; מוכן
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 text-right space-y-2">
                  <h3 className="font-medium text-slate-700 mb-3">סיכום הפרטים:</h3>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">שם:</span> {step1Data.householdName}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">אימייל:</span> {step1Data.primaryEmail}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">הכנסה חודשית:</span> ₪
                    {step3Data.totalMonthlyIncome.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">בני משפחה:</span>{" "}
                    {1 + (step2Data.hasSpouse ? 1 : 0) + step2Data.childrenCount}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-right">
                  <p className="text-sm text-blue-700">
                    💡 <strong>טיפ:</strong> בשלב הבא תוכלו להגדיר את התקציב החודשי שלכם
                    ולהתחיל לעקוב אחר ההוצאות עם פיטר.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && currentStep < 4 ? (
            <Button variant="outline" onClick={handleBack}>
              <ChevronRight className="w-4 h-4 ml-2" />
              הקודם
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              הבא
              <ChevronLeft className="w-4 h-4 mr-2" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={isLoading}
              className="bg-emerald-500 hover:bg-emerald-600 w-full"
            >
              {isLoading ? "יוצר את משק הבית..." : "🎉 התחל להשתמש ב-PiterPay"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
