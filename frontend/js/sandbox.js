/* ============================================
   MedJava — Sandbox Client
   Manages the Java project editor and
   communicates with the backend runner
   ============================================ */

const MJSandbox = (() => {
  const PROJECTS = [
    { id: 'proj-triage', name: 'P1: Vital Signs Triage', icon: 'fa-heartbeat',
      mainClass: 'VitalSignsTriage',
      files: [{ path: 'VitalSignsTriage.java', content:
`public class VitalSignsTriage {
    public static void main(String[] args) {
        System.out.println("=== Vital Signs Triage System ===\\n");

        // Test patient data (hardcoded for sandbox testing)
        String name = "Ama Darko";
        double temp = 39.5;       // °C
        int heartRate = 125;      // bpm
        int systolicBP = 85;      // mmHg

        System.out.println("Patient: " + name);
        System.out.println("Temperature: " + temp + " °C");
        System.out.println("Heart Rate: " + heartRate + " bpm");
        System.out.println("Blood Pressure: " + systolicBP + " mmHg");

        // Triage classification logic
        String triageLevel;
        String action;

        if (temp > 39 || heartRate > 120 || systolicBP < 90) {
            triageLevel = "EMERGENCY (Red)";
            action = "Immediate medical attention required!";
        } else if (temp > 38 || heartRate > 100 || systolicBP < 100) {
            triageLevel = "URGENT (Yellow)";
            action = "Priority assessment within 30 minutes.";
        } else {
            triageLevel = "ROUTINE (Green)";
            action = "Standard queue, monitor vitals.";
        }

        System.out.println("\\n--- TRIAGE RESULT ---");
        System.out.println("Level: " + triageLevel);
        System.out.println("Action: " + action);

        // Show which criteria triggered
        if (temp > 39) System.out.println("  [!] HIGH TEMPERATURE: " + temp + " > 39°C");
        if (heartRate > 120) System.out.println("  [!] TACHYCARDIA: " + heartRate + " > 120 bpm");
        if (systolicBP < 90) System.out.println("  [!] HYPOTENSION: " + systolicBP + " < 90 mmHg");
    }
}` }]
    },
    { id: 'proj-bmi', name: 'P2: BMI Classifier', icon: 'fa-weight-scale',
      mainClass: 'BMIClassifier',
      files: [{ path: 'BMIClassifier.java', content:
`public class BMIClassifier {
    public static void main(String[] args) {
        System.out.println("=== BMI & Category Classifier ===\\n");

        // Test patient data
        String name = "Kwame Mensah";
        double weight = 92.0;  // kg
        double height = 1.72;  // meters

        System.out.println("Patient: " + name);
        System.out.println("Weight: " + weight + " kg");
        System.out.println("Height: " + height + " m");

        // Calculate BMI
        double bmi = weight / (height * height);
        System.out.println("BMI: " + String.format("%.1f", bmi));

        // Classify
        String category;
        String advice;

        if (bmi < 18.5) {
            category = "Underweight";
            advice = "Nutritional assessment recommended. Consider dietary supplementation.";
        } else if (bmi < 25.0) {
            category = "Normal weight";
            advice = "Maintain current lifestyle. Regular checkups recommended.";
        } else if (bmi < 30.0) {
            category = "Overweight";
            advice = "Lifestyle modification advised. 30min exercise daily, reduce processed foods.";
        } else {
            category = "Obese";
            advice = "Medical intervention recommended. Refer to dietitian. Screen for diabetes and hypertension.";
        }

        System.out.println("\\n--- RESULT ---");
        System.out.println("Category: " + category);
        System.out.println("Advice: " + advice);

        // Additional risk flags
        if (bmi >= 30) {
            System.out.println("\\n[!] ALERT: BMI >= 30 — screen for:");
            System.out.println("    - Type 2 Diabetes (FBS, HbA1c)");
            System.out.println("    - Hypertension (BP check)");
            System.out.println("    - Dyslipidemia (Lipid profile)");
        }
    }
}` }]
    },
    { id: 'proj-records', name: 'P3: Patient Records', icon: 'fa-file-medical',
      mainClass: 'PatientRecords',
      files: [{ path: 'PatientRecords.java', content:
`import java.util.ArrayList;

public class PatientRecords {
    public static void main(String[] args) {
        ArrayList<String> patients = new ArrayList<>();

        System.out.println("=== Patient Records Manager ===\\n");

        // Simulate adding patients
        patients.add("Ama Darko, F, 34, Malaria");
        patients.add("Kwame Mensah, M, 67, Hypertension");
        patients.add("Kofi Asante, M, 5, Pneumonia");
        patients.add("Akua Boateng, F, 28, Prenatal checkup");
        patients.add("Yaw Adjei, M, 72, Diabetic foot ulcer");

        System.out.println("Added " + patients.size() + " patients.\\n");

        // List all patients
        System.out.println("--- ALL PATIENTS ---");
        for (int i = 0; i < patients.size(); i++) {
            System.out.println((i + 1) + ". " + patients.get(i));
        }

        // Search for a patient
        String searchTerm = "Kwame";
        System.out.println("\\n--- SEARCH: \\"" + searchTerm + "\\" ---");
        boolean found = false;
        for (String p : patients) {
            if (p.toLowerCase().contains(searchTerm.toLowerCase())) {
                System.out.println("FOUND: " + p);
                found = true;
            }
        }
        if (!found) System.out.println("No patient found matching \\"" + searchTerm + "\\"");

        // Remove a patient (discharged)
        patients.remove(2);
        System.out.println("\\nPatient at index 3 discharged. Remaining: " + patients.size());

        System.out.println("\\nRecords system working correctly.");
    }
}` }]
    },
    { id: 'proj-icu', name: 'P4: ICU Monitor', icon: 'fa-monitor-waveform',
      mainClass: 'ICUMonitor',
      files: [{ path: 'ICUMonitor.java', content:
`public class ICUMonitor {
    public static void main(String[] args) {
        System.out.println("=== ICU Vital Signs Monitor ===");

        // TODO: Simulate monitoring 3 patients
        // Each patient has: name, heartRate, oxygenLevel, bloodPressure
        // Check vitals every "cycle" and alert if abnormal
        // Use loops to simulate 5 monitoring cycles

        String[] patients = {"Ama Darko", "Kwame Mensah", "Kofi Asante"};
        int[] heartRates = {72, 110, 55};
        int[] oxygenLevels = {98, 91, 95};

        System.out.println("Monitoring " + patients.length + " patients...");
        System.out.println("[TODO: Implement monitoring loop]");
    }
}` }]
    },
    { id: 'proj-prescription', name: 'P5: Prescription Calc', icon: 'fa-prescription',
      mainClass: 'PrescriptionCalc',
      files: [{ path: 'PrescriptionCalc.java', content:
`public class PrescriptionCalc {
    public static void main(String[] args) {
        System.out.println("=== Weight-Based Prescription Calculator ===\\n");

        // Test patient data
        String patientName = "Baby Adjei";
        double weight = 12.5;  // kg (pediatric patient)
        String drug = "Amoxicillin";
        double dosePerKg = 25.0;  // mg/kg/dose
        int dosesPerDay = 3;
        int durationDays = 7;
        double maxSingleDose = 500.0;  // mg

        System.out.println("Patient: " + patientName);
        System.out.println("Weight: " + weight + " kg");
        System.out.println("Drug: " + drug);
        System.out.println("Dose: " + dosePerKg + " mg/kg/dose");

        // Calculate
        double singleDose = weight * dosePerKg;
        double dailyDose = singleDose * dosesPerDay;
        double totalCourse = dailyDose * durationDays;

        // Safety checks
        boolean doseExceeded = singleDose > maxSingleDose;
        if (doseExceeded) {
            System.out.println("\\n[!] WARNING: Calculated dose " + singleDose + "mg exceeds max " + maxSingleDose + "mg");
            singleDose = maxSingleDose;
            System.out.println("    Dose CAPPED at " + maxSingleDose + "mg per dose");
        }

        System.out.println("\\n--- PRESCRIPTION ---");
        System.out.println("Rx: " + drug + " " + String.format("%.0f", singleDose) + "mg");
        System.out.println("    " + dosesPerDay + " times daily x " + durationDays + " days");
        System.out.println("    Daily total: " + String.format("%.0f", dailyDose) + "mg");
        System.out.println("    Course total: " + String.format("%.0f", totalCourse) + "mg");

        // Validate
        if (weight <= 0) System.out.println("ERROR: Invalid weight!");
        if (dosePerKg <= 0) System.out.println("ERROR: Invalid dose!");
        System.out.println("\\nPrescription generated successfully.");
    }
}` }]
    },
    { id: 'proj-emr', name: 'P6: Encrypted EMR', icon: 'fa-lock',
      mainClass: 'EncryptedEMR', files: [{ path: 'EncryptedEMR.java', content:
`public class EncryptedEMR {
    public static void main(String[] args) {
        System.out.println("=== Encrypted EMR Service ===");
        System.out.println("[Advanced project - requires OOP and File I/O knowledge]");
        System.out.println("TODO: Implement after completing the OOP section");
    }
}` }]
    },
    { id: 'proj-hl7', name: 'P7: HL7 Parser', icon: 'fa-code',
      mainClass: 'HL7Parser', files: [{ path: 'HL7Parser.java', content:
`public class HL7Parser {
    public static void main(String[] args) {
        System.out.println("=== HL7 Message Parser ===");

        // Sample HL7 ADT message
        String hl7Message = "MSH|^~\\\\&|HIS|HOSPITAL|LAB|HOSPITAL|20240115||ADT^A01|123|P|2.5\\r"
            + "PID|||12345||Darko^Ama||19850315|F|||Accra, Ghana\\r"
            + "PV1||I|ICU^01^01";

        System.out.println("Raw HL7 Message:");
        System.out.println(hl7Message.replace("\\r", "\\n"));

        // TODO: Parse segments by splitting on \\r
        // TODO: Parse fields by splitting on |
        // TODO: Extract patient name, ID, and location

        System.out.println("\\n[TODO: Implement parsing logic]");
    }
}` }]
    },
    { id: 'proj-lab', name: 'P8: Lab Analyzer', icon: 'fa-vial',
      mainClass: 'LabAnalyzer', files: [{ path: 'LabAnalyzer.java', content:
`public class LabAnalyzer {
    public static void main(String[] args) {
        System.out.println("=== Lab Result Analyzer ===");

        // Sample lab results
        String[] testNames = {"Hemoglobin", "White Blood Cells", "Platelets", "Glucose"};
        double[] results = {10.5, 15000, 120000, 250};
        double[] lowLimits = {12.0, 4000, 150000, 70};
        double[] highLimits = {16.0, 11000, 400000, 100};
        String[] units = {"g/dL", "/uL", "/uL", "mg/dL"};

        // TODO: Loop through results
        // TODO: Flag as LOW, NORMAL, or HIGH
        // TODO: Mark critical values with ALERT

        System.out.println("[TODO: Implement analysis logic]");
    }
}` }]
    },
    { id: 'proj-drugs', name: 'P9: Drug Interactions', icon: 'fa-capsules',
      mainClass: 'DrugInteractions', files: [{ path: 'DrugInteractions.java', content:
`public class DrugInteractions {
    public static void main(String[] args) {
        System.out.println("=== Drug Interaction Checker ===");
        System.out.println("[Advanced project - requires HashMap knowledge]");
        System.out.println("TODO: Implement after completing Data Structures section");
    }
}` }]
    },
    { id: 'proj-ml', name: 'P10: ML Diagnosis', icon: 'fa-brain',
      mainClass: 'MLDiagnosis', files: [{ path: 'MLDiagnosis.java', content:
`public class MLDiagnosis {
    public static void main(String[] args) {
        System.out.println("=== ML Diagnosis Assistant ===");
        System.out.println("[Advanced project - requires ML section completion]");
        System.out.println("TODO: Implement after completing Machine Learning section");
    }
}` }]
    },
    // ===== HARDCORE MEDICAL PROJECTS =====
    { id: 'proj-ecg', name: 'P11: ECG R-Peak Detector', icon: 'fa-wave-square',
      mainClass: 'ECGDetector', files: [{ path: 'ECGDetector.java', content:
`import java.util.ArrayList;

public class ECGDetector {
    public static void main(String[] args) {
        System.out.println("=== ECG R-Peak Detector ===");
        System.out.println("Pan-Tompkins Algorithm Implementation\\n");

        // Simulated ECG signal (mV values sampled at 250Hz)
        double[] ecgSignal = {
            0.1, 0.15, 0.2, 0.3, 0.5, 0.9, 1.8, 2.5, 1.2, 0.4,
            0.1, -0.3, -0.1, 0.05, 0.1, 0.12, 0.1, 0.08, 0.1, 0.15,
            0.2, 0.3, 0.5, 0.85, 1.7, 2.4, 1.1, 0.35, 0.1, -0.25,
            -0.1, 0.05, 0.1, 0.11, 0.1, 0.09, 0.1, 0.14, 0.2, 0.28,
            0.48, 0.88, 1.75, 2.45, 1.15, 0.38, 0.1, -0.28, -0.1, 0.05
        };
        int samplingRate = 250; // Hz

        // TODO Step 1: Apply bandpass filter (5-15 Hz) to remove noise
        // TODO Step 2: Differentiate the signal to find slopes
        // TODO Step 3: Square the signal to amplify QRS complexes
        // TODO Step 4: Apply moving window integration (150ms window)
        // TODO Step 5: Apply adaptive thresholding to detect R-peaks
        // TODO Step 6: Calculate heart rate from R-R intervals
        // TODO Step 7: Classify: Normal (60-100), Bradycardia (<60), Tachycardia (>100)

        System.out.println("Signal length: " + ecgSignal.length + " samples");
        System.out.println("Duration: " + (ecgSignal.length / (double)samplingRate) + " seconds");
        System.out.println("\\n[TODO: Implement Pan-Tompkins algorithm]");

        // Expected output after implementation:
        // R-peaks found at: sample 6, 25, 43
        // R-R intervals: 76ms, 72ms
        // Heart rate: ~197 bpm (TACHYCARDIA - ALERT!)
    }
}` }]
    },
    { id: 'proj-hrv', name: 'P12: Heart Rate Variability', icon: 'fa-chart-line',
      mainClass: 'HRVCalculator', files: [{ path: 'HRVCalculator.java', content:
`public class HRVCalculator {
    public static void main(String[] args) {
        System.out.println("=== Heart Rate Variability (HRV) Calculator ===\\n");

        // R-R intervals in milliseconds from a 5-minute ECG recording
        double[] rrIntervals = {
            812, 798, 825, 801, 790, 835, 810, 792, 805, 820,
            815, 788, 830, 808, 795, 822, 800, 810, 818, 793,
            840, 805, 785, 828, 812, 798, 815, 803, 790, 832,
            808, 795, 825, 810, 788, 835, 802, 812, 820, 795,
            830, 805, 792, 818, 800, 810, 825, 798, 785, 838
        };

        // TODO Step 1: Calculate mean R-R interval
        // TODO Step 2: Calculate SDNN (standard deviation of all R-R intervals)
        //   - This measures overall HRV. Normal: 100-180ms
        // TODO Step 3: Calculate RMSSD (root mean square of successive differences)
        //   - Measures short-term variability. Normal: 20-75ms
        // TODO Step 4: Calculate pNN50 (% of successive intervals differing by >50ms)
        //   - Parasympathetic activity marker. Normal: 5-25%
        // TODO Step 5: Risk assessment:
        //   - Low HRV (SDNN < 50ms) = high cardiac risk
        //   - Normal HRV (SDNN 100-180ms) = healthy autonomic function
        //   - High HRV (SDNN > 200ms) = excellent fitness or possible arrhythmia

        System.out.println("Total R-R intervals: " + rrIntervals.length);
        System.out.println("Recording duration: ~" + (rrIntervals.length * 0.8) + " seconds");
        System.out.println("\\n[TODO: Implement HRV metrics]");
    }
}` }]
    },
    { id: 'proj-gcs', name: 'P13: Glasgow Coma Scale', icon: 'fa-head-side-medical',
      mainClass: 'GCSCalculator', files: [{ path: 'GCSCalculator.java', content:
`public class GCSCalculator {
    public static void main(String[] args) {
        System.out.println("=== Glasgow Coma Scale (GCS) Calculator ===");
        System.out.println("Emergency Department — Trauma Assessment\\n");

        String name = "Ama Darko";  // Test patient

        // EYE OPENING RESPONSE (E)
        System.out.println("\\n--- Eye Opening Response ---");
        System.out.println("4 = Spontaneous");
        System.out.println("3 = To voice/command");
        System.out.println("2 = To pain/pressure");
        System.out.println("1 = None");
                int eye = 0;  // Test value

        // VERBAL RESPONSE (V)
        System.out.println("\\n--- Verbal Response ---");
        System.out.println("5 = Oriented (knows name, place, date)");
        System.out.println("4 = Confused speech");
        System.out.println("3 = Inappropriate words");
        System.out.println("2 = Incomprehensible sounds");
        System.out.println("1 = None");
                int verbal = 0;  // Test value

        // MOTOR RESPONSE (M)
        System.out.println("\\n--- Motor Response ---");
        System.out.println("6 = Obeys commands");
        System.out.println("5 = Localizes pain");
        System.out.println("4 = Withdrawal (flexion)");
        System.out.println("3 = Abnormal flexion (decorticate)");
        System.out.println("2 = Extension (decerebrate)");
        System.out.println("1 = None");
                int motor = 0;  // Test value

        // TODO: Validate each score is within valid range
        // TODO: Calculate total GCS = E + V + M
        // TODO: Classify severity:
        //   13-15 = Mild brain injury
        //   9-12 = Moderate brain injury
        //   3-8 = Severe brain injury (intubation likely needed)
        // TODO: If GCS <= 8, print "ALERT: Consider intubation and ICU admission"
        // TODO: If pupil reactivity data available, calculate GCS-P (GCS minus pupil score)
        // TODO: Print full assessment report

        int total = eye + verbal + motor;
        System.out.println("\\n=== GCS Assessment Report ===");
        System.out.println("Patient: " + name);
        System.out.println("E" + eye + " V" + verbal + " M" + motor + " = GCS " + total);
        System.out.println("[TODO: Add severity classification and recommendations]");

        // Done
    }
}` }]
    },
    { id: 'proj-sepsis', name: 'P14: Sepsis Screening (qSOFA)', icon: 'fa-virus',
      mainClass: 'SepsisScreen', files: [{ path: 'SepsisScreen.java', content:
`public class SepsisScreen {
    public static void main(String[] args) {
        System.out.println("=== Sepsis Screening Tool ===");
        System.out.println("qSOFA + SOFA Score Calculator\\n");

        String name = "Ama Darko";  // Test patient

        // qSOFA (Quick Sequential Organ Failure Assessment)
        System.out.println("\\n--- qSOFA Criteria ---");
                int respRate = 0;  // Test value

                int sbp = 0;  // Test value

                int alteredMental = 0;  // Test value

        // TODO: Calculate qSOFA score (0-3)
        //   +1 if respiratory rate >= 22
        //   +1 if systolic BP <= 100
        //   +1 if altered mental status
        // TODO: If qSOFA >= 2, flag "HIGH RISK — suspect sepsis"

        // Full SOFA Score
        System.out.println("\\n--- Full SOFA Score Components ---");
                double pf = 0.0;  // Test value
                int platelets = 0;  // Test value
                double bilirubin = 0.0;  // Test value
                double creatinine = 0.0;  // Test value
                int map = 0;  // Test value
                int gcs = 0;  // Test value

        // TODO: Score each SOFA component 0-4 based on clinical ranges
        // TODO: Total SOFA score. If increase >= 2 from baseline = organ dysfunction
        // TODO: Mortality risk by SOFA: <2 = <10%, 2-6 = <10%, 7-9 = 15-20%, >11 = >25%
        // TODO: Generate clinical alert with recommended actions
        // TODO: Flag if lactate measurement is needed (lactate > 2 mmol/L = septic shock)

        System.out.println("\\n[TODO: Implement qSOFA and SOFA scoring]");
        // Done
    }
}` }]
    },
    { id: 'proj-bsa', name: 'P15: Chemo Dose Calculator', icon: 'fa-prescription-bottle-medical',
      mainClass: 'ChemoDoseCalc', files: [{ path: 'ChemoDoseCalc.java', content:
`public class ChemoDoseCalc {
    public static void main(String[] args) {
        System.out.println("=== Chemotherapy Dose Calculator ===");
        System.out.println("BSA-Based Dosing with Safety Limits\\n");

        String name = "Ama Darko";  // Test patient
                double height = 0.0;  // Test value
                double weight = 0.0;  // Test value
                int age = 0;  // Test value
                double crCl = 0.0;  // Test value

        // TODO Step 1: Calculate BSA using Mosteller formula
        //   BSA = sqrt((height_cm * weight_kg) / 3600)

        // TODO Step 2: Calculate BSA using DuBois formula
        //   BSA = 0.007184 * height^0.725 * weight^0.425

        // TODO Step 3: Cap BSA at 2.0 m² for obese patients (safety)

        // TODO Step 4: Calculate doses for CHOP regimen:
        //   Cyclophosphamide: 750 mg/m² (max single dose: 2000mg)
        //   Doxorubicin: 50 mg/m² (lifetime max: 450 mg/m²)
        //   Vincristine: 1.4 mg/m² (HARD CAP at 2mg — neurotoxicity)
        //   Prednisone: 100 mg flat dose (not BSA-based)

        // TODO Step 5: Renal dose adjustment
        //   If CrCl < 30: reduce Cyclophosphamide by 25%
        //   If CrCl < 10: contraindicated — STOP

        // TODO Step 6: Age adjustment
        //   If age > 70: reduce all doses by 20%

        // TODO Step 7: Print full prescription with safety checks

        System.out.println("\\n[TODO: Implement BSA calculation and dose adjustments]");
        // Done
    }
}` }]
    },
    { id: 'proj-growth', name: 'P16: WHO Growth Chart', icon: 'fa-baby',
      mainClass: 'GrowthChart', files: [{ path: 'GrowthChart.java', content:
`public class GrowthChart {
    public static void main(String[] args) {
        System.out.println("=== WHO Growth Chart — Pediatric Z-Score Calculator ===\\n");

        // WHO Weight-for-age reference data (boys, 0-24 months)
        // Each row: {age_months, L, M, S} from WHO LMS tables
        double[][] whoBoysWeight = {
            {0, 0.3487, 3.3464, 0.14602},
            {1, 0.2297, 4.4709, 0.13395},
            {3, 0.0361, 6.3762, 0.12328},
            {6, -0.1756, 7.9340, 0.11589},
            {9, -0.1348, 9.1649, 0.11105},
            {12, -0.1553, 9.8973, 0.10880},
            {18, -0.2231, 11.1369, 0.10514},
            {24, -0.3521, 12.1515, 0.10303},
        };

        // Test patient
        String patientName = "Baby Kwame";
        int ageMonths = 9;
        double weight = 7.5; // kg
        String sex = "M";

        // TODO Step 1: Find the correct reference row for this age
        // TODO Step 2: Calculate Z-score using LMS method:
        //   Z = ((value/M)^L - 1) / (L * S)   when L != 0
        //   Z = ln(value/M) / S                when L == 0
        // TODO Step 3: Convert Z-score to percentile
        // TODO Step 4: Classify:
        //   Z < -3: Severely underweight (RED alert)
        //   Z < -2: Underweight (ORANGE alert)
        //   -2 to +2: Normal range
        //   Z > +2: Overweight (YELLOW alert)
        //   Z > +3: Obese (RED alert)
        // TODO Step 5: Print growth assessment with clinical recommendation

        System.out.println("Patient: " + patientName + " (" + sex + ")");
        System.out.println("Age: " + ageMonths + " months");
        System.out.println("Weight: " + weight + " kg");
        System.out.println("\\n[TODO: Implement Z-score calculation]");
    }
}` }]
    },
    { id: 'proj-partograph', name: 'P17: Partograph Monitor', icon: 'fa-person-pregnant',
      mainClass: 'Partograph', files: [{ path: 'Partograph.java', content:
`public class Partograph {
    public static void main(String[] args) {
        System.out.println("=== Partograph — Labor Progress Monitor ===");
        System.out.println("WHO Modified Partograph Implementation\\n");

        // Simulated cervical dilation readings during labor
        // Each entry: {hours_since_active_labor, dilation_cm, descent_station}
        double[][] laborProgress = {
            {0, 4, -3},    // Active labor starts at 4cm
            {1, 4.5, -3},
            {2, 5, -2},
            {3, 5.5, -2},
            {4, 6, -1},
            {5, 6, -1},    // Stall?
            {6, 6.5, 0},
            {7, 7, 0},
            {8, 8, +1},
            {9, 9, +2},
            {10, 10, +3},  // Fully dilated
        };

        // Fetal heart rate readings (every 30 min)
        int[] fetalHR = {140, 142, 138, 145, 135, 130, 125, 118, 110, 105, 100};
        // Normal: 110-160 bpm

        // TODO Step 1: Plot cervical dilation against the alert line
        //   Alert line: starts at 4cm, expects 1cm/hour progress
        //   Action line: 4 hours to the right of alert line
        // TODO Step 2: Detect if dilation crosses the alert line (slow progress)
        // TODO Step 3: Detect if dilation crosses the action line (URGENT intervention)
        // TODO Step 4: Monitor fetal heart rate for decelerations
        //   < 110 bpm = concern, < 100 bpm = EMERGENCY
        // TODO Step 5: Flag prolonged labor (> 12 hours in active phase)
        // TODO Step 6: Generate labor progress report with alerts

        System.out.println("Labor readings: " + laborProgress.length + " entries");
        System.out.println("FHR readings: " + fetalHR.length + " entries");
        System.out.println("\\n[TODO: Implement partograph analysis]");
    }
}` }]
    },
    { id: 'proj-apgar', name: 'P18: APGAR + NICU Scoring', icon: 'fa-hospital-user',
      mainClass: 'APGARScore', files: [{ path: 'APGARScore.java', content:
`public class APGARScore {
    public static void main(String[] args) {
        System.out.println("=== APGAR Score + NICU Severity Assessment ===\\n");

        String id = "NB-2024-001";  // Test newborn
                int gestAge = 0;  // Test value
                int birthWeight = 0;  // Test value

        System.out.println("\\n--- 1-Minute APGAR ---");
                int a1 = 0;  // Test value
                int p1 = 0;  // Test value
                int g1 = 0;  // Test value
                int ac1 = 0;  // Test value
                int r1 = 0;  // Test value

        // TODO: Repeat for 5-minute APGAR
        // TODO: Calculate total APGAR at 1 min and 5 min
        // TODO: Classify:
        //   7-10: Normal (routine care)
        //   4-6: Moderate depression (stimulation, possible CPAP)
        //   0-3: Severe depression (immediate resuscitation, intubation)
        // TODO: If 5-min APGAR < 7, continue scoring at 10, 15, 20 min
        // TODO: Calculate SNAP-II score for NICU admission if preterm
        //   Components: MAP, pO2/FiO2, lowest temperature, urine output, seizures
        // TODO: Birth weight classification:
        //   < 1000g: ELBW (Extremely Low Birth Weight)
        //   < 1500g: VLBW (Very Low Birth Weight)
        //   < 2500g: LBW (Low Birth Weight)

        int total1 = a1 + p1 + g1 + ac1 + r1;
        System.out.println("\\n1-Minute APGAR: " + total1 + "/10");
        System.out.println("[TODO: Complete implementation]");
        // Done
    }
}` }]
    },
    { id: 'proj-epi', name: 'P19: EPI Immunization Tracker', icon: 'fa-syringe',
      mainClass: 'EPITracker', files: [{ path: 'EPITracker.java', content:
`public class EPITracker {
    public static void main(String[] args) {
        System.out.println("=== Ghana EPI Immunization Schedule Tracker ===\\n");

        String name = "Baby Kwame";  // Test child
                String dob = 0;  // Test value
                int ageWeeks = 0;  // Test value

        // Ghana EPI Schedule
        // Week 0 (birth): BCG, OPV-0
        // Week 6: Penta-1, OPV-1, PCV-1, Rota-1
        // Week 10: Penta-2, OPV-2, PCV-2, Rota-2
        // Week 14: Penta-3, OPV-3, PCV-3, IPV
        // Month 9: Measles-Rubella-1, Yellow Fever
        // Month 18: Measles-Rubella-2

        // TODO Step 1: Model each vaccine as: name, dose number, due age in weeks, given (boolean), date given
        // TODO Step 2: Based on child's current age, determine:
        //   - Which vaccines are due NOW
        //   - Which are OVERDUE (past due date by > 2 weeks)
        //   - Which are UPCOMING (due within next 4 weeks)
        //   - Which are COMPLETED
        // TODO Step 3: Calculate overall immunization completion percentage
        // TODO Step 4: Flag any OVERDUE vaccines with RED alert
        // TODO Step 5: Print immunization card with status for each vaccine
        // TODO Step 6: Handle catch-up scheduling for missed vaccines

        System.out.println("\\nChild: " + name);
        System.out.println("DOB: " + dob);
        System.out.println("Current age: " + ageWeeks + " weeks");
        System.out.println("\\n[TODO: Implement immunization tracking]");
        // Done
    }
}` }]
    },
    { id: 'proj-bloodbank', name: 'P20: Blood Bank Manager', icon: 'fa-droplet',
      mainClass: 'BloodBank', files: [{ path: 'BloodBank.java', content:
`public class BloodBank {
    public static void main(String[] args) {
        System.out.println("=== Blood Bank Inventory & Compatibility Manager ===\\n");

        // Blood inventory: {type, Rh, units_available, expiry_days_remaining}
        String[][] inventory = {
            {"A", "+", "12", "28"},
            {"A", "-", "3", "14"},
            {"B", "+", "8", "21"},
            {"B", "-", "2", "7"},
            {"AB", "+", "5", "35"},
            {"AB", "-", "1", "5"},
            {"O", "+", "15", "30"},
            {"O", "-", "4", "10"},
        };

        String recipientType = "B";
        String recipientRh = "+";

        // TODO Step 1: Display full inventory with expiry alerts
        //   RED if expiry <= 7 days, YELLOW if <= 14 days
        // TODO Step 2: Implement compatibility matrix
        //   O- is universal donor
        //   AB+ is universal recipient
        //   Same type always compatible
        //   Rh- can receive Rh- only, Rh+ can receive both
        // TODO Step 3: For given recipient, list all compatible blood types in order of preference
        // TODO Step 4: Check if enough units available, considering other pending requests
        // TODO Step 5: FIFO expiry management — use oldest stock first
        // TODO Step 6: Critical low alert if any type has <= 2 units
        // TODO Step 7: Cross-match verification checklist

        System.out.println("Recipient: " + recipientType + recipientRh);
        System.out.println("\\n[TODO: Implement blood bank logic]");
    }
}` }]
    },
    { id: 'proj-westgard', name: 'P21: Lab QC (Westgard Rules)', icon: 'fa-chart-column',
      mainClass: 'WestgardQC', files: [{ path: 'WestgardQC.java', content:
`public class WestgardQC {
    public static void main(String[] args) {
        System.out.println("=== Laboratory Quality Control — Westgard Rules ===\\n");

        // QC control measurements for Glucose analyzer
        double targetMean = 100.0;  // mg/dL
        double targetSD = 3.0;      // mg/dL

        // 20 consecutive QC runs
        double[] qcResults = {
            101.2, 99.8, 100.5, 103.1, 98.7, 106.5, 107.2, 99.1,
            97.8, 96.5, 95.2, 98.3, 100.1, 101.5, 102.8, 103.2,
            104.1, 105.5, 106.8, 108.1
        };

        // TODO: Implement Westgard Multi-Rule QC System
        // Rule 1_2s: WARNING if 1 control exceeds mean ± 2SD (investigate)
        // Rule 1_3s: REJECT if 1 control exceeds mean ± 3SD (random error)
        // Rule 2_2s: REJECT if 2 consecutive controls exceed mean + 2SD or mean - 2SD (systematic error)
        // Rule R_4s: REJECT if range between 2 controls within a run exceeds 4SD
        // Rule 4_1s: REJECT if 4 consecutive controls exceed mean + 1SD or mean - 1SD (shift/trend)
        // Rule 10x:  REJECT if 10 consecutive controls are on the same side of mean (bias)

        // TODO: For each rule violation, classify as random error or systematic error
        // TODO: Print Levey-Jennings chart as ASCII art showing ±1SD, ±2SD, ±3SD zones
        // TODO: Generate corrective action recommendations

        System.out.println("Target: " + targetMean + " ± " + targetSD + " mg/dL");
        System.out.println("QC runs: " + qcResults.length);
        System.out.println("\\n[TODO: Implement Westgard rules]");
    }
}` }]
    },
    { id: 'proj-abg', name: 'P22: ABG Interpreter', icon: 'fa-lungs',
      mainClass: 'ABGInterpreter', files: [{ path: 'ABGInterpreter.java', content:
`public class ABGInterpreter {
    public static void main(String[] args) {
        System.out.println("=== Arterial Blood Gas (ABG) Interpreter ===\\n");

        String name = "Ama Darko";  // Test patient

                double pH = 0.0;  // Test value
                double paCO2 = 0.0;  // Test value
                double hco3 = 0.0;  // Test value
                double paO2 = 0.0;  // Test value
                double saO2 = 0.0;  // Test value

        // TODO Step 1: Determine acidosis vs alkalosis (pH < 7.35 or > 7.45)
        // TODO Step 2: Determine respiratory vs metabolic PRIMARY disorder
        //   Respiratory: PaCO2 is abnormal and matches pH change
        //   Metabolic: HCO3 is abnormal and matches pH change
        // TODO Step 3: Check for compensation
        //   Respiratory acidosis: expected HCO3 rise = (PaCO2-40) * 0.1 (acute) or * 0.35 (chronic)
        //   Metabolic acidosis: expected PaCO2 = (1.5 * HCO3) + 8 ± 2 (Winter's formula)
        //   Metabolic alkalosis: expected PaCO2 = (0.7 * HCO3) + 21 ± 2
        // TODO Step 4: Calculate A-a gradient = (FiO2*(713) - PaCO2/0.8) - PaO2
        //   Normal A-a gradient = (Age/4) + 4
        //   Elevated = V/Q mismatch, shunt, diffusion impairment
        // TODO Step 5: Calculate PaO2/FiO2 ratio for ARDS classification
        //   > 300 = normal, 200-300 = mild ARDS, 100-200 = moderate, < 100 = severe
        // TODO Step 6: Generate complete interpretation with clinical correlation

        System.out.println("\\n[TODO: Implement ABG interpretation algorithm]");
        // Done
    }
}` }]
    },
    { id: 'proj-nhis', name: 'P23: NHIS Claims Processor', icon: 'fa-file-invoice-dollar',
      mainClass: 'NHISProcessor', files: [{ path: 'NHISProcessor.java', content:
`public class NHISProcessor {
    public static void main(String[] args) {
        System.out.println("=== Ghana NHIS Claims Processor ===\\n");

        // Simulated claims data
        // Each: {claimID, memberID, facilityCode, diagnosisCode, procedureCodes[], totalAmount, dateOfService}
        String[][] claims = {
            {"CLM001", "NHIS-2024-00145", "GHS-0312", "J18.9", "90471,99213", "245.00", "2024-03-15"},
            {"CLM002", "NHIS-2024-00278", "GHS-0312", "K35.80", "44950,99223", "3200.00", "2024-03-15"},
            {"CLM003", "NHIS-2024-00145", "GHS-0312", "J18.9", "90471,99213", "245.00", "2024-03-15"}, // duplicate!
            {"CLM004", "NHIS-2024-00390", "GHS-0450", "O80", "59400,99231", "1800.00", "2024-03-16"},
            {"CLM005", "NHIS-2024-00412", "GHS-0312", "E11.9", "99214,83036", "180.00", "2024-03-16"},
        };

        // NHIS tariff limits by diagnosis group
        // J18 (Pneumonia): max 500 GHS
        // K35 (Appendicitis surgery): max 3000 GHS
        // O80 (Normal delivery): max 2000 GHS
        // E11 (Diabetes management): max 250 GHS

        // TODO Step 1: Validate each claim has all required fields
        // TODO Step 2: Check member eligibility (NHIS card active, not expired)
        // TODO Step 3: Detect duplicate claims (same member + same diagnosis + same date)
        // TODO Step 4: Verify amounts against NHIS tariff ceiling per diagnosis group
        // TODO Step 5: Flag claims exceeding tariff for manual review
        // TODO Step 6: Calculate total approved vs rejected vs pending
        // TODO Step 7: Generate claims batch summary report

        System.out.println("Total claims in batch: " + claims.length);
        System.out.println("\\n[TODO: Implement claims processing engine]");
    }
}` }]
    },
    { id: 'proj-phq9', name: 'P24: PHQ-9 Depression Screen', icon: 'fa-brain',
      mainClass: 'PHQ9Screen', files: [{ path: 'PHQ9Screen.java', content:
`public class PHQ9Screen {
    public static void main(String[] args) {
        System.out.println("=== PHQ-9 Patient Health Questionnaire ===");
        System.out.println("Depression Screening Tool\\n");

        String name = "Ama Darko";  // Test patient

        String[] questions = {
            "Little interest or pleasure in doing things",
            "Feeling down, depressed, or hopeless",
            "Trouble falling/staying asleep, or sleeping too much",
            "Feeling tired or having little energy",
            "Poor appetite or overeating",
            "Feeling bad about yourself — or that you're a failure",
            "Trouble concentrating on things",
            "Moving or speaking slowly, or being fidgety/restless",
            "Thoughts that you would be better off dead, or of hurting yourself"
        };

        System.out.println("Over the last 2 weeks, how often have you been bothered by:");
        System.out.println("0 = Not at all");
        System.out.println("1 = Several days");
        System.out.println("2 = More than half the days");
        System.out.println("3 = Nearly every day\\n");

        int[] scores = new int[9];
        for (int i = 0; i < questions.length; i++) {
            System.out.println((i+1) + ". " + questions[i]);
            System.out.print("   Score (0-3): ");
            scores[i] = (i == 0) ? 2 : (i == 1) ? 3 : (i == 8) ? 1 : 2;  // Test scores
        }

        // TODO: Calculate total PHQ-9 score (0-27)
        // TODO: Classify severity:
        //   0-4: Minimal depression
        //   5-9: Mild depression
        //   10-14: Moderate depression
        //   15-19: Moderately severe depression
        //   20-27: Severe depression
        // TODO: If question 9 score > 0, flag SAFETY ALERT
        //   "Patient endorsed suicidal ideation — immediate safety assessment required"
        // TODO: Recommend treatment based on severity:
        //   Mild: watchful waiting, lifestyle changes
        //   Moderate: consider therapy (CBT) and/or medication
        //   Severe: urgent psychiatric referral + medication

        System.out.println("\\n[TODO: Implement scoring and risk assessment]");
        // Done
    }
}` }]
    },
    { id: 'proj-outbreak', name: 'P25: Outbreak Detector', icon: 'fa-triangle-exclamation',
      mainClass: 'OutbreakDetector', files: [{ path: 'OutbreakDetector.java', content:
`public class OutbreakDetector {
    public static void main(String[] args) {
        System.out.println("=== Disease Outbreak Detection System ===");
        System.out.println("EWARS — Early Warning and Response System\\n");

        // Weekly malaria case counts for Accra region (past 12 weeks + current)
        int[] weeklyCases = {45, 52, 48, 55, 50, 47, 53, 49, 51, 48, 52, 50, 85};

        // Weekly cholera case counts
        int[] choleraCases = {2, 1, 3, 2, 1, 0, 2, 1, 3, 2, 8, 15, 28};

        // TODO Step 1: Calculate epidemic threshold using C2 method
        //   Mean of same week in previous years + 2 standard deviations
        //   Simplified: mean of past 12 weeks + 2 * SD
        // TODO Step 2: For each disease, check if current week exceeds threshold
        // TODO Step 3: Calculate the Alert Ratio = current / threshold
        //   > 1.0 = ALERT, > 1.5 = OUTBREAK CONFIRMED
        // TODO Step 4: Detect trends — 3 consecutive weeks of increase = early warning
        // TODO Step 5: Calculate attack rate = cases / population * 1000
        // TODO Step 6: Generate epidemic curve (ASCII chart showing weekly cases)
        // TODO Step 7: Generate alert notification with:
        //   - Disease name, location, date
        //   - Current cases vs threshold
        //   - Recommended response actions
        //   - Contact tracing requirements

        System.out.println("Malaria cases this week: " + weeklyCases[weeklyCases.length-1]);
        System.out.println("Cholera cases this week: " + choleraCases[choleraCases.length-1]);
        System.out.println("\\n[TODO: Implement outbreak detection algorithm]");
    }
}` }]
    },
    { id: 'proj-dicom-reader', name: 'P26: DICOM Metadata Reader', icon: 'fa-x-ray',
      mainClass: 'DICOMReader', files: [{ path: 'DICOMReader.java', content:
`public class DICOMReader {
    public static void main(String[] args) {
        System.out.println("=== DICOM File Metadata Reader ===\\n");

        // Simulated DICOM header tags (Tag -> VR -> Value)
        String[][] dicomTags = {
            {"(0010,0010)", "PN", "Darko^Ama"},                    // Patient Name
            {"(0010,0020)", "LO", "PAT-2024-00789"},               // Patient ID
            {"(0010,0030)", "DA", "19850315"},                      // Birth Date
            {"(0010,0040)", "CS", "F"},                             // Sex
            {"(0008,0060)", "CS", "CT"},                            // Modality
            {"(0008,1030)", "LO", "CT ABDOMEN WITH CONTRAST"},     // Study Description
            {"(0008,0020)", "DA", "20240315"},                      // Study Date
            {"(0008,0050)", "SH", "ACC-2024-12345"},               // Accession Number
            {"(0020,0013)", "IS", "45"},                            // Instance Number
            {"(0028,0010)", "US", "512"},                           // Rows
            {"(0028,0011)", "US", "512"},                           // Columns
            {"(0028,0100)", "US", "16"},                            // Bits Allocated
            {"(0028,1050)", "DS", "40"},                            // Window Center
            {"(0028,1051)", "DS", "400"},                           // Window Width
            {"(0008,0016)", "UI", "1.2.840.10008.5.1.4.1.1.2"},   // SOP Class UID (CT)
        };

        // TODO Step 1: Parse each tag into group and element numbers
        // TODO Step 2: Map standard DICOM tags to human-readable names
        // TODO Step 3: Validate required tags are present (Patient Name, ID, Modality, Study Date)
        // TODO Step 4: Calculate image dimensions from Rows x Columns
        // TODO Step 5: Determine modality and apply modality-specific tag validation
        //   CT requires: Window Center, Window Width, kVp, mAs
        //   MR requires: TR, TE, Flip Angle, Magnetic Field Strength
        //   XR requires: kVp, mAs, Body Part
        // TODO Step 6: Calculate window/level range for display
        //   Min HU = Window Center - Window Width/2
        //   Max HU = Window Center + Window Width/2
        // TODO Step 7: Print formatted patient study report

        System.out.println("Tags found: " + dicomTags.length);
        System.out.println("\\n[TODO: Implement DICOM tag parser]");
    }
}` }]
    },
    { id: 'proj-drug-interact', name: 'P27: Drug Interaction Engine', icon: 'fa-capsules',
      mainClass: 'DrugInteractionEngine', files: [{ path: 'DrugInteractionEngine.java', content:
`public class DrugInteractionEngine {
    public static void main(String[] args) {
        System.out.println("=== Drug-Drug Interaction Checker ===");
        System.out.println("Clinical Decision Support System\\n");

        // Drug interaction database
        // {Drug A, Drug B, Severity, Mechanism, Clinical Effect, Action}
        String[][] interactions = {
            {"Warfarin", "Aspirin", "MAJOR", "Additive anticoagulation", "Increased bleeding risk", "AVOID or monitor INR closely"},
            {"Warfarin", "Metronidazole", "MAJOR", "CYP2C9 inhibition", "Increased warfarin effect", "Reduce warfarin dose 25-50%"},
            {"Metformin", "Contrast dye", "MAJOR", "Renal clearance", "Lactic acidosis risk", "Hold metformin 48h before/after contrast"},
            {"ACE inhibitor", "Potassium", "MAJOR", "Additive hyperkalemia", "Cardiac arrhythmia risk", "Monitor potassium levels"},
            {"Simvastatin", "Erythromycin", "MAJOR", "CYP3A4 inhibition", "Rhabdomyolysis risk", "Use alternative antibiotic"},
            {"Ciprofloxacin", "Antacids", "MODERATE", "Chelation", "Reduced absorption of cipro", "Give cipro 2h before antacid"},
            {"SSRI", "Tramadol", "MAJOR", "Serotonin syndrome", "Seizures, hyperthermia", "AVOID combination"},
            {"Digoxin", "Amiodarone", "MAJOR", "P-gp inhibition", "Digoxin toxicity", "Reduce digoxin dose by 50%"},
            {"Lithium", "NSAID", "MAJOR", "Reduced renal clearance", "Lithium toxicity", "Monitor lithium levels closely"},
            {"Fluconazole", "QT drugs", "MAJOR", "QT prolongation", "Torsades de pointes", "ECG monitoring required"},
        };

        // Patient's current medications
        System.out.println("Enter patient medications (comma separated):");
        String input = 0;  // Test value
        String[] meds = input.split(",");

        // TODO: Trim and normalize each medication name
        // TODO: Check every pair of medications against the interaction database
        // TODO: For each interaction found, display:
        //   Severity (MAJOR/MODERATE/MINOR) with color coding
        //   The two drugs involved
        //   Mechanism of interaction
        //   Clinical effect
        //   Recommended action
        // TODO: Sort results by severity (MAJOR first)
        // TODO: Count total interactions by severity level
        // TODO: If any MAJOR interaction found, print prominent warning

        System.out.println("\\nMedications entered: " + meds.length);
        System.out.println("\\n[TODO: Implement interaction checking engine]");
        // Done
    }
}` }]
    },
    { id: 'proj-ews', name: 'P28: Early Warning Score', icon: 'fa-bell',
      mainClass: 'EarlyWarningScore', files: [{ path: 'EarlyWarningScore.java', content:
`public class EarlyWarningScore {
    public static void main(String[] args) {
        System.out.println("=== National Early Warning Score (NEWS2) ===");
        System.out.println("Acute Deterioration Detection\\n");

        String name = "Ama Darko";  // Test patient

                int rr = 0;  // Test value
                int spo2 = 0;  // Test value
                int suppO2 = 0;  // Test value
                int sbp = 0;  // Test value
                int pulse = 0;  // Test value
        System.out.print("Consciousness (A=alert, C=confusion, V=voice, P=pain, U=unresponsive): ");
        String avpu = "C";  // Confused
                double temp = 0.0;  // Test value

        // TODO: Score each parameter 0-3 based on NEWS2 ranges:
        //   RR: <=8(3), 9-11(1), 12-20(0), 21-24(2), >=25(3)
        //   SpO2 Scale 1: <=91(3), 92-93(2), 94-95(1), >=96(0)
        //   Supplemental O2: Yes(2), No(0)
        //   SBP: <=90(3), 91-100(2), 101-110(1), 111-219(0), >=220(3)
        //   Pulse: <=40(3), 41-50(1), 51-90(0), 91-110(1), 111-130(2), >=131(3)
        //   Consciousness: A(0), C/V/P/U(3)
        //   Temp: <=35.0(3), 35.1-36.0(1), 36.1-38.0(0), 38.1-39.0(1), >=39.1(2)

        // TODO: Calculate aggregate NEWS2 score
        // TODO: Determine clinical response:
        //   0: Routine monitoring
        //   1-4 LOW: Increase frequency to 4-6 hourly
        //   3 in single parameter: Urgent review by clinician
        //   5-6 MEDIUM: Urgent review, consider ICU outreach
        //   >= 7 HIGH: Emergency assessment, continuous monitoring, consider ICU

        System.out.println("\\n[TODO: Implement NEWS2 scoring]");
        // Done
    }
}` }]
    },
    { id: 'proj-hosp-queue', name: 'P29: OPD Queue Manager', icon: 'fa-people-line',
      mainClass: 'OPDQueue', files: [{ path: 'OPDQueue.java', content:
`public class OPDQueue {
    public static void main(String[] args) {
        System.out.println("=== OPD Queue Management System ===");
        System.out.println("Priority-Based Patient Scheduling\\n");

        // Simulated patient queue
        // {ticketNo, name, age, chiefComplaint, triageCategory, arrivalTime}
        String[][] patients = {
            {"T001", "Ama Darko", "34", "Headache x 3 days", "ROUTINE", "08:00"},
            {"T002", "Kwame Mensah", "67", "Chest pain radiating to left arm", "EMERGENCY", "08:05"},
            {"T003", "Akua Boateng", "28", "Prenatal checkup", "ROUTINE", "08:10"},
            {"T004", "Kofi Asante", "5", "High fever 40°C, seizure", "EMERGENCY", "08:12"},
            {"T005", "Efua Owusu", "45", "Cough x 2 weeks, weight loss", "URGENT", "08:15"},
            {"T006", "Yaw Adjei", "72", "Diabetic foot ulcer", "URGENT", "08:20"},
            {"T007", "Abena Mensah", "19", "Sore throat", "ROUTINE", "08:22"},
            {"T008", "Kwesi Appiah", "55", "Shortness of breath, SpO2 88%", "EMERGENCY", "08:25"},
        };

        // TODO Step 1: Implement priority queue based on triage category
        //   EMERGENCY (Red) → seen immediately
        //   URGENT (Yellow) → seen within 30 minutes
        //   ROUTINE (Green) → first-come first-served after urgent cases
        // TODO Step 2: Within same priority, sort by arrival time (FIFO)
        // TODO Step 3: Estimate wait time based on:
        //   Average consultation time: Emergency 20min, Urgent 15min, Routine 10min
        //   Number of doctors available: 3
        // TODO Step 4: Display queue board showing:
        //   Current patient being seen (per doctor)
        //   Next 5 patients in queue with estimated wait time
        //   Total patients waiting per category
        // TODO Step 5: Handle re-triage (patient condition worsens while waiting)
        // TODO Step 6: Track average wait times and flag if exceeding targets

        System.out.println("Patients in queue: " + patients.length);
        System.out.println("\\n[TODO: Implement priority queue system]");
    }
}` }]
    },
    { id: 'proj-mortality', name: 'P30: Mortality Predictor', icon: 'fa-skull-crossbones',
      mainClass: 'MortalityPredictor', files: [{ path: 'MortalityPredictor.java', content:
`public class MortalityPredictor {
    public static void main(String[] args) {
        System.out.println("=== ICU Mortality Risk Prediction ===");
        System.out.println("APACHE II Score Calculator\\n");

        // Patient data for APACHE II calculation
        String name = "Kwame Mensah";
        int age = 67;
        // Acute Physiology Score components (worst values in first 24h of ICU)
        double temperature = 39.5;       // °C
        double meanArtPressure = 55;     // mmHg
        int heartRate = 135;             // bpm
        int respiratoryRate = 32;        // breaths/min
        double paO2 = 55;               // mmHg (if FiO2 < 0.5, use A-a gradient)
        double arterialPH = 7.25;
        double sodium = 155;             // mEq/L
        double potassium = 6.2;          // mEq/L
        double creatinine = 3.8;         // mg/dL (double points if acute renal failure)
        double hematocrit = 25;          // %
        int wbc = 25000;                 // /mm3
        int gcs = 8;                     // Glasgow Coma Scale

        boolean acuteRenalFailure = true;
        boolean emergencySurgery = true;

        // Chronic health conditions
        boolean chronicLiver = false;
        boolean chronicCardiac = true;
        boolean chronicRenal = false;
        boolean immunocompromised = false;

        // TODO Step 1: Score each of the 12 physiology variables (0-4 points each)
        //   based on how far from normal range
        // TODO Step 2: Calculate Acute Physiology Score (APS) = sum of 12 variables
        // TODO Step 3: Add Age Points: 44(0), 45-54(2), 55-64(3), 65-74(5), 75+(6)
        // TODO Step 4: Add Chronic Health Points:
        //   Non-operative or emergency surgery with chronic condition: +5
        //   Elective surgery with chronic condition: +2
        // TODO Step 5: APACHE II = APS + Age Points + Chronic Health Points
        // TODO Step 6: Calculate predicted mortality using logistic regression:
        //   ln(R/(1-R)) = -3.517 + (APACHE_II * 0.146) + emergency_surgery_coefficient
        // TODO Step 7: Print risk assessment with confidence interval
        // TODO Step 8: Compare to ICU benchmark mortality for this score range

        System.out.println("Patient: " + name + ", Age: " + age);
        System.out.println("GCS: " + gcs + ", HR: " + heartRate + ", MAP: " + meanArtPressure);
        System.out.println("\\n[TODO: Implement APACHE II scoring]");
    }
}` }]
    },
    // ===== HARDCORE TIER 2: P31-P50 =====
    { id: 'proj-hl7-engine', name: 'P31: HL7 Message Builder', icon: 'fa-message',
      mainClass: 'HL7Builder', files: [{ path: 'HL7Builder.java', content:
`public class HL7Builder {
    public static void main(String[] args) {
        System.out.println("=== HL7 v2.x Message Builder & Validator ===\\n");

        // Build an ADT^A01 (Admit) message from patient data
        String patientName = "Darko^Ama^Yaa";
        String patientID = "PAT-2024-00789";
        String dob = "19850315";
        String sex = "F";
        String wardCode = "ICU^01^BED-03";
        String admitDate = "20240315143022";
        String attendingDoc = "Mensah^Kofi^Dr";
        String diagnosisCode = "J18.9";
        String diagnosisText = "Pneumonia, unspecified organism";

        // TODO Step 1: Build MSH segment (Message Header)
        //   MSH|^~\\&|HIS|KORLE-BU|LAB|KORLE-BU|<timestamp>||ADT^A01|<msgID>|P|2.5
        // TODO Step 2: Build EVN segment (Event Type)
        // TODO Step 3: Build PID segment (Patient Identification)
        //   PID|||<ID>||<Name>||<DOB>|<Sex>
        // TODO Step 4: Build PV1 segment (Patient Visit)
        //   PV1||I|<Ward>|||<AttendingDoc>
        // TODO Step 5: Build DG1 segment (Diagnosis)
        // TODO Step 6: Validate all required fields are present
        // TODO Step 7: Validate segment order (MSH must be first)
        // TODO Step 8: Validate field lengths per HL7 spec
        // TODO Step 9: Generate unique Message Control ID
        // TODO Step 10: Build ACK message (acknowledgment)
        // TODO Step 11: Parse the built message back and verify round-trip

        System.out.println("[TODO: Build HL7 message from patient data]");
    }
}` }]
    },
    { id: 'proj-fhir', name: 'P32: FHIR Patient Resource', icon: 'fa-fire',
      mainClass: 'FHIRPatient', files: [{ path: 'FHIRPatient.java', content:
`public class FHIRPatient {
    public static void main(String[] args) {
        System.out.println("=== FHIR R4 Patient Resource Builder ===\\n");

        // Build a FHIR Patient resource as JSON
        // TODO: Create a Patient JSON with:
        //   resourceType, id, meta (versionId, lastUpdated)
        //   identifier (NHIS number, hospital MRN)
        //   name (family, given, prefix)
        //   telecom (phone, email)
        //   gender, birthDate
        //   address (line, city, district, country = "GH")
        //   maritalStatus, contact (next of kin)
        //   communication (language: "ak" for Akan, "en" for English)
        // TODO: Validate required fields per FHIR spec
        // TODO: Build a Bundle with multiple patients
        // TODO: Simulate a FHIR search: GET /Patient?name=Darko&birthdate=1985-03-15
        // TODO: Build a FHIR Observation resource for vital signs
        // TODO: Link Observation to Patient via reference

        System.out.println("[TODO: Implement FHIR resource builder]");
    }
}` }]
    },
    { id: 'proj-aes-encrypt', name: 'P33: Patient Data Encryption', icon: 'fa-lock',
      mainClass: 'PatientEncrypt', files: [{ path: 'PatientEncrypt.java', content:
`public class PatientEncrypt {
    public static void main(String[] args) {
        System.out.println("=== Patient Record Encryption Service ===");
        System.out.println("AES-256-GCM + SHA-256 Hashing\\n");

        String patientRecord = "Name: Ama Darko | DOB: 1985-03-15 | HIV Status: Positive | CD4: 350";
        String patientID = "PAT-2024-00789";

        // TODO Step 1: Hash the patient ID using SHA-256 for lookup tables
        //   This allows searching without exposing the real ID
        // TODO Step 2: Generate a random 256-bit AES key
        // TODO Step 3: Generate a random 12-byte IV (nonce)
        // TODO Step 4: Encrypt the patient record using AES-256-GCM
        //   GCM provides both confidentiality AND authenticity
        // TODO Step 5: Store: {hashedID, encryptedRecord, IV, authTag}
        // TODO Step 6: Decrypt and verify the record
        // TODO Step 7: Implement key rotation (re-encrypt with new key)
        // TODO Step 8: Implement field-level encryption
        //   Encrypt only sensitive fields (HIV status, diagnosis) not demographics
        // TODO Step 9: Audit log: log who accessed which record, when, and why
        // TODO Step 10: Implement access control levels:
        //   DOCTOR: full access | NURSE: no HIV/mental health | BILLING: demographics only

        System.out.println("Record length: " + patientRecord.length() + " chars");
        System.out.println("[TODO: Implement encryption pipeline]");
    }
}` }]
    },
    { id: 'proj-ecg-12lead', name: 'P34: 12-Lead ECG Interpreter', icon: 'fa-heart-pulse',
      mainClass: 'ECG12Lead', files: [{ path: 'ECG12Lead.java', content:
`public class ECG12Lead {
    public static void main(String[] args) {
        System.out.println("=== 12-Lead ECG Interpretation System ===\\n");

        // Simulated ECG findings per lead
        // Format: {lead, P_wave, PR_interval_ms, QRS_duration_ms, ST_segment, T_wave, Q_wave}
        String[][] ecgFindings = {
            {"I",   "normal", "160", "88", "elevated_2mm", "inverted", "absent"},
            {"II",  "normal", "160", "88", "elevated_1mm", "normal",   "absent"},
            {"III", "normal", "160", "88", "normal",       "normal",   "absent"},
            {"aVR", "inverted","160","88", "depressed",    "inverted", "absent"},
            {"aVL", "normal", "160", "88", "elevated_2mm", "inverted", "pathological"},
            {"aVF", "normal", "160", "88", "normal",       "normal",   "absent"},
            {"V1",  "normal", "160", "88", "depressed",    "normal",   "absent"},
            {"V2",  "normal", "160", "88", "elevated_3mm", "hyperacute","absent"},
            {"V3",  "normal", "160", "88", "elevated_4mm", "hyperacute","pathological"},
            {"V4",  "normal", "160", "88", "elevated_3mm", "hyperacute","pathological"},
            {"V5",  "normal", "160", "88", "elevated_1mm", "inverted", "absent"},
            {"V6",  "normal", "160", "88", "normal",       "inverted", "absent"},
        };

        // TODO: Determine rhythm (rate from R-R intervals)
        // TODO: Determine axis (from leads I and aVF)
        // TODO: Check PR interval: >200ms = first degree heart block
        // TODO: Check QRS duration: >120ms = bundle branch block
        // TODO: Identify ST elevation pattern and map to coronary territory:
        //   V1-V4 = LAD (anterior), II/III/aVF = RCA (inferior), I/aVL/V5-V6 = LCX (lateral)
        // TODO: Check for reciprocal ST depression (confirms acute MI)
        // TODO: Identify hyperacute T waves (earliest sign of MI)
        // TODO: Check for pathological Q waves (completed infarction)
        // TODO: Generate interpretation report: "STEMI — Anterior wall — activate cath lab"

        System.out.println("Leads analyzed: " + ecgFindings.length);
        System.out.println("[TODO: Implement ECG interpretation engine]");
    }
}` }]
    },
    { id: 'proj-ventilator', name: 'P35: Ventilator Settings Calc', icon: 'fa-wind',
      mainClass: 'VentilatorCalc', files: [{ path: 'VentilatorCalc.java', content:
`public class VentilatorCalc {
    public static void main(String[] args) {
        System.out.println("=== Mechanical Ventilator Settings Calculator ===");
        System.out.println("ARDSNet Protocol Implementation\\n");

                double height = 0.0;  // Test value
        System.out.print("Patient sex (M/F): ");
        String sex = "F";  // Test patient
                double pfRatio = 0.0;  // Test value
                double pPlat = 0.0;  // Test value

        // TODO Step 1: Calculate Ideal Body Weight (IBW)
        //   Male: 50 + 2.3 * (height_inches - 60)
        //   Female: 45.5 + 2.3 * (height_inches - 60)
        // TODO Step 2: Initial tidal volume = 6-8 mL/kg IBW (start at 8, target 6)
        // TODO Step 3: Set respiratory rate 14-22 to maintain minute ventilation
        // TODO Step 4: PEEP/FiO2 table from ARDSNet:
        //   Mild ARDS (PF 200-300): PEEP 5, FiO2 0.4
        //   Moderate (PF 100-200): PEEP 10, FiO2 0.6
        //   Severe (PF < 100): PEEP 14-18, FiO2 0.8-1.0
        // TODO Step 5: Plateau pressure check: must be <= 30 cmH2O
        //   If > 30: reduce tidal volume by 1 mL/kg until <= 30
        // TODO Step 6: Calculate driving pressure = Plateau - PEEP (target < 15)
        // TODO Step 7: Print complete ventilator prescription

        System.out.println("[TODO: Implement ventilator calculations]");
        // Done
    }
}` }]
    },
    { id: 'proj-insulin', name: 'P36: Insulin Dose Calculator', icon: 'fa-syringe',
      mainClass: 'InsulinCalc', files: [{ path: 'InsulinCalc.java', content:
`public class InsulinCalc {
    public static void main(String[] args) {
        System.out.println("=== Insulin Dosing Calculator ===");
        System.out.println("Basal-Bolus + Sliding Scale\\n");

                double weight = 0.0;  // Test value
                int type = 0;  // Test value
                double hba1c = 0.0;  // Test value
                double glucose = 0.0;  // Test value
                double carbs = 0.0;  // Test value

        // TODO Step 1: Calculate Total Daily Dose (TDD)
        //   Type 1: 0.5 units/kg/day
        //   Type 2: 0.3-0.5 units/kg (start low if new to insulin)
        // TODO Step 2: Split into basal (50%) and bolus (50%)
        //   Basal = TDD * 0.5 (given as Lantus/Levemir once daily)
        //   Bolus = TDD * 0.5 / 3 meals
        // TODO Step 3: Carb ratio = 500 / TDD (1 unit per X grams of carbs)
        // TODO Step 4: Correction factor = 1800 / TDD (mg/dL drop per unit)
        //   Target glucose: 120 mg/dL
        // TODO Step 5: Meal dose = (carbs / carb_ratio) + correction
        //   Correction = (current_glucose - 120) / correction_factor
        // TODO Step 6: Sliding scale for inpatient:
        //   < 150: 0 units, 150-200: 2u, 201-250: 4u, 251-300: 6u,
        //   301-350: 8u, > 350: 10u + call doctor
        // TODO Step 7: Safety checks: dose capping, hypoglycemia risk

        System.out.println("[TODO: Implement insulin calculator]");
        // Done
    }
}` }]
    },
    { id: 'proj-antibiotic', name: 'P37: Antibiotic Stewardship', icon: 'fa-pills',
      mainClass: 'AntibioticGuide', files: [{ path: 'AntibioticGuide.java', content:
`public class AntibioticGuide {
    public static void main(String[] args) {
        System.out.println("=== Antibiotic Stewardship Decision Support ===\\n");

        System.out.print("Infection site (UTI/PNEUMONIA/SKIN/SEPSIS/MENINGITIS): ");
        String site = "PNEUMONIA";  // Test
        System.out.print("Community-acquired or Hospital-acquired? (C/H): ");
        String setting = "C";  // Community
        System.out.print("Patient allergic to Penicillin? (Y/N): ");
        String penAllergy = "N";  // No allergy
                double crCl = 0.0;  // Test value
                double weight = 0.0;  // Test value

        // TODO: Build empiric antibiotic recommendation engine:
        //   UTI (community): 1st Nitrofurantoin, 2nd Ciprofloxacin
        //   UTI (hospital): 1st Piperacillin-tazobactam, 2nd Meropenem
        //   Pneumonia (community): 1st Amoxicillin+Azithromycin, 2nd Levofloxacin
        //   Pneumonia (hospital): 1st Piperacillin-tazobactam, 2nd Meropenem+Vancomycin
        //   Sepsis: 1st Meropenem+Vancomycin (broad spectrum, de-escalate when cultures ready)
        //   Meningitis: 1st Ceftriaxone+Vancomycin+Dexamethasone
        // TODO: Penicillin allergy cross-reactivity check
        // TODO: Renal dose adjustment for each antibiotic
        // TODO: Duration recommendation based on site
        // TODO: De-escalation reminder at 48-72 hours (when cultures return)
        // TODO: Calculate cost per day of therapy

        System.out.println("[TODO: Implement antibiotic decision engine]");
        // Done
    }
}` }]
    },
    { id: 'proj-fluid', name: 'P38: IV Fluid Calculator', icon: 'fa-droplet',
      mainClass: 'FluidCalc', files: [{ path: 'FluidCalc.java', content:
`public class FluidCalc {
    public static void main(String[] args) {
        System.out.println("=== IV Fluid & Electrolyte Calculator ===\\n");

                double weight = 0.0;  // Test value
                int age = 0;  // Test value
                double sodium = 0.0;  // Test value
                double potassium = 0.0;  // Test value
                double dehydration = 0.0;  // Test value

        // TODO Step 1: Calculate maintenance fluid (Holliday-Segar):
        //   First 10 kg: 100 mL/kg, Next 10 kg: 50 mL/kg, Each kg above 20: 20 mL/kg
        // TODO Step 2: Calculate deficit = weight * dehydration% * 10 (mL)
        // TODO Step 3: Replacement plan: 50% deficit in first 8h, 50% over next 16h + maintenance
        // TODO Step 4: Sodium correction for hyponatremia:
        //   Desired correction rate: 8-10 mEq/L per 24h (faster = osmotic demyelination risk!)
        //   3% NaCl volume = (desired Na - current Na) * weight * 0.6 / 513 * 1000
        // TODO Step 5: Potassium replacement:
        //   K < 3.0: severe, IV replacement max 20 mEq/hour (cardiac monitoring required)
        //   K 3.0-3.5: moderate, oral or IV 10 mEq/hour
        // TODO Step 6: Choose fluid type: NS (0.9% NaCl), D5W, Ringer's Lactate, 3% NaCl
        // TODO Step 7: Calculate drip rate = volume / (hours * 60) * drop_factor

        System.out.println("[TODO: Implement fluid calculator]");
        // Done
    }
}` }]
    },
    { id: 'proj-transfusion', name: 'P39: Transfusion Reaction Monitor', icon: 'fa-droplet',
      mainClass: 'TransfusionMonitor', files: [{ path: 'TransfusionMonitor.java', content:
`public class TransfusionMonitor {
    public static void main(String[] args) {
        System.out.println("=== Blood Transfusion Reaction Monitoring ===\\n");

        String name = "Ama Darko";  // Test patient
        System.out.print("Blood product (PRBC/FFP/PLATELETS/CRYO): ");
        String product = "PRBC";  // Test

        System.out.println("\\n--- Baseline vitals (before transfusion) ---");
                double baseTemp = 0.0;  // Test value
                int baseHR = 0;  // Test value
                int baseSBP = 0;  // Test value
                int baseSpO2 = 0;  // Test value

        System.out.println("\\n--- 15-minute check vitals ---");
                double checkTemp = 0.0;  // Test value
                int checkHR = 0;  // Test value
                int checkSBP = 0;  // Test value
                int checkSpO2 = 0;  // Test value

        // TODO: Compare baseline to 15-minute vitals
        // TODO: Detect febrile reaction: temp rise >= 1°C
        // TODO: Detect hemolytic reaction: temp rise + BP drop + tachycardia
        // TODO: Detect allergic reaction: urticaria, wheezing, SpO2 drop
        // TODO: Detect TACO: BP rise + SpO2 drop + dyspnea (volume overload)
        // TODO: Detect TRALI: SpO2 drop + bilateral infiltrates (within 6h)
        // TODO: Action protocol for each reaction type:
        //   Mild allergic: slow rate, give antihistamine
        //   Febrile: stop, give acetaminophen, investigate
        //   Hemolytic: STOP IMMEDIATELY, NS wide open, send samples
        //   Anaphylaxis: STOP, epinephrine, call code blue

        System.out.println("\\n[TODO: Implement reaction detection]");
        // Done
    }
}` }]
    },
    { id: 'proj-surgical', name: 'P40: Surgical Safety Checklist', icon: 'fa-scissors',
      mainClass: 'SurgicalChecklist', files: [{ path: 'SurgicalChecklist.java', content:
`public class SurgicalChecklist {
    public static void main(String[] args) {
        System.out.println("=== WHO Surgical Safety Checklist ===");
        System.out.println("3-Phase Verification System\\n");

        // TODO: Implement all 3 phases of WHO checklist:
        // SIGN IN (before anesthesia):
        //   - Patient identity confirmed? (Y/N)
        //   - Site marked? (Y/N)
        //   - Consent signed? (Y/N)
        //   - Anesthesia safety check done? (Y/N)
        //   - Pulse oximeter on and functioning? (Y/N)
        //   - Known allergy? (Y/N, if yes list them)
        //   - Difficult airway risk? (Y/N)
        //   - Blood loss risk > 500mL? (Y/N, if yes blood available?)
        // TIME OUT (before incision):
        //   - All team members introduced by name and role?
        //   - Surgeon confirms: patient name, procedure, site
        //   - Anticipated critical events discussed?
        //   - Antibiotic prophylaxis given within 60 min? (Y/N)
        //   - Essential imaging displayed? (Y/N)
        // SIGN OUT (before leaving OR):
        //   - Procedure recorded correctly?
        //   - Instrument, sponge, needle counts correct?
        //   - Specimen labeled? (Y/N)
        //   - Equipment problems to address?
        //   - Key concerns for recovery and management?
        // TODO: ALL items must be Y to proceed. Any N = STOP and resolve
        // TODO: Log timestamp for each phase completion
        // TODO: Generate signed checklist PDF-style report

        System.out.println("[TODO: Implement surgical safety checklist]");
        // Done
    }
}` }]
    },
    { id: 'proj-malaria', name: 'P41: Malaria Severity Scorer', icon: 'fa-mosquito',
      mainClass: 'MalariaSeverity', files: [{ path: 'MalariaSeverity.java', content:
`public class MalariaSeverity {
    public static void main(String[] args) {
        System.out.println("=== Severe Malaria Assessment Tool ===");
        System.out.println("WHO Criteria for Severe P. falciparum Malaria\\n");

        String name = "Ama Darko";  // Test patient
                int age = 0;  // Test value
                int parasitemia = 0;  // Test value
                double hb = 0.0;  // Test value
                double glucose = 0.0;  // Test value
                double creat = 0.0;  // Test value
                double bili = 0.0;  // Test value
                double lactate = 0.0;  // Test value
                int gcs = 0;  // Test value

        // TODO: Check WHO severe malaria criteria:
        //   Cerebral malaria: GCS < 11
        //   Severe anemia: Hb < 5 g/dL (adults) or < 5 (children)
        //   Hypoglycemia: glucose < 40 mg/dL
        //   Renal failure: creatinine > 3 mg/dL
        //   Jaundice + parasitemia > 100,000
        //   Hyperparasitemia: > 10% infected RBCs
        //   Acidosis: lactate > 5 mmol/L
        //   Shock: SBP < 80 mmHg
        // TODO: ANY one criterion = SEVERE → IV Artesunate required
        // TODO: Treatment protocol:
        //   Uncomplicated: ACT (Artemether-Lumefantrine) oral x 3 days
        //   Severe: IV Artesunate 2.4mg/kg at 0, 12, 24h then daily
        //   Switch to oral ACT when patient can eat
        // TODO: Ghana-specific: NHIS coverage check for antimalarials

        System.out.println("[TODO: Implement severity assessment]");
        // Done
    }
}` }]
    },
    { id: 'proj-pregnancy-risk', name: 'P42: Pregnancy Risk Scorer', icon: 'fa-person-pregnant',
      mainClass: 'PregnancyRisk', files: [{ path: 'PregnancyRisk.java', content:
`public class PregnancyRisk {
    public static void main(String[] args) {
        System.out.println("=== High-Risk Pregnancy Assessment ===\\n");

        String name = "Ama Darko";  // Test patient
        System.out.print("Age: "); int age = 0;  // Test value
        System.out.print("Gravidity (number of pregnancies): "); int gravida = 0;  // Test value
        System.out.print("Parity (number of deliveries): "); int parity = 0;  // Test value
        System.out.print("Gestational age (weeks): "); int ga = 0;  // Test value
        System.out.print("Systolic BP: "); int sbp = 0;  // Test value
        System.out.print("Diastolic BP: "); int dbp = 0;  // Test value
        System.out.print("Urine protein (0=none, 1=trace, 2=1+, 3=2+, 4=3+): "); int protein = 0;  // Test value
        System.out.print("Blood glucose (mg/dL): "); double glucose = 0.0;  // Test value
        System.out.print("Hemoglobin (g/dL): "); double hb = 0.0;  // Test value
        System.out.print("Previous C-section? (1=yes, 0=no): "); int prevCS = 0;  // Test value
        System.out.print("Previous stillbirth? (1=yes, 0=no): "); int prevStill = 0;  // Test value

        // TODO: Classify risk factors:
        //   Age < 18 or > 35: high risk
        //   Grand multipara (parity >= 5): high risk
        //   BP > 140/90 + protein: preeclampsia screen positive
        //   BP > 160/110: severe preeclampsia → MgSO4 + urgent delivery plan
        //   Glucose > 140: gestational diabetes screen positive → OGTT needed
        //   Hb < 7: severe anemia → transfusion may be needed
        //   Previous CS: VBAC vs repeat CS risk assessment
        // TODO: Calculate Bishop Score for delivery readiness
        // TODO: Generate antenatal care plan with visit schedule
        // TODO: Flag for referral if district hospital cannot manage

        System.out.println("[TODO: Implement pregnancy risk assessment]");
        // Done
    }
}` }]
    },
    { id: 'proj-ward-bed', name: 'P43: Ward Bed Manager', icon: 'fa-bed',
      mainClass: 'WardBedManager', files: [{ path: 'WardBedManager.java', content:
`public class WardBedManager {
    public static void main(String[] args) {
        System.out.println("=== Hospital Ward & Bed Management System ===\\n");

        // Hospital layout: 6 wards, each with beds
        String[] wardNames = {"Medical Male", "Medical Female", "Surgical", "Pediatrics", "Maternity", "ICU"};
        int[] totalBeds =    {30,             25,               20,         15,           20,          8};
        int[] occupied =     {28,             22,               18,         10,           19,          8};

        // Pending admissions queue
        String[][] pendingAdmissions = {
            {"Kofi Asante", "M", "65", "Pneumonia", "Medical Male", "URGENT"},
            {"Ama Serwaa", "F", "28", "Appendicitis", "Surgical", "EMERGENCY"},
            {"Yaa Mensah", "F", "25", "Normal delivery", "Maternity", "ROUTINE"},
            {"Baby Adjei", "M", "0", "Neonatal jaundice", "Pediatrics", "URGENT"},
            {"Kwame Boateng", "M", "72", "STEMI", "ICU", "EMERGENCY"},
        };

        // TODO: Display bed occupancy dashboard per ward (occupied/total, % utilization)
        // TODO: Flag wards at >= 90% capacity as CRITICAL
        // TODO: Process admission queue by priority (EMERGENCY > URGENT > ROUTINE)
        // TODO: Auto-assign beds (if available) or add to waiting list
        // TODO: Handle ICU full scenario: identify step-down candidates
        // TODO: Calculate average length of stay per ward
        // TODO: Predict discharge dates and bed availability
        // TODO: Generate bed status board (like a real hospital whiteboard)

        System.out.println("Total beds: " + java.util.Arrays.stream(totalBeds).sum());
        System.out.println("[TODO: Implement bed management system]");
    }
}` }]
    },
    { id: 'proj-consent', name: 'P44: Informed Consent Manager', icon: 'fa-file-signature',
      mainClass: 'ConsentManager', files: [{ path: 'ConsentManager.java', content:
`public class ConsentManager {
    public static void main(String[] args) {
        System.out.println("=== Informed Consent Management System ===\\n");

        String name = "Ama Darko";
        String procedure = "Appendectomy";
        String doctor = "Dr. Mensah";

        // TODO: Build consent document with:
        //   - Patient identification (name, DOB, hospital number)
        //   - Procedure name and description in plain language
        //   - Risks (common and rare but serious)
        //   - Benefits
        //   - Alternatives (including no treatment)
        //   - Right to refuse or withdraw consent
        //   - Interpreter used? (Y/N, language)
        //   - Patient capacity assessment (can they understand?)
        //   - If no capacity: who is the legal surrogate?
        //   - Witness information
        //   - Timestamps: explained, questions answered, signed
        // TODO: Validate all required fields before marking as complete
        // TODO: Version control — if consent is amended, keep history
        // TODO: Digital signature simulation (hash of consent + timestamp)
        // TODO: Ghana Data Protection Act compliance check

        System.out.println("[TODO: Implement consent management]");
        // Done
    }
}` }]
    },
    { id: 'proj-referral', name: 'P45: Patient Referral System', icon: 'fa-share-from-square',
      mainClass: 'ReferralSystem', files: [{ path: 'ReferralSystem.java', content:
`public class ReferralSystem {
    public static void main(String[] args) {
        System.out.println("=== Ghana Health Service — Patient Referral System ===\\n");

        // Referral chain: CHPS → Health Center → District Hospital → Regional Hospital → Teaching Hospital
        String[][] facilities = {
            {"CHPS Abokobi", "CHPS", "Level A", "GPS:5.7169,-0.1623"},
            {"Madina Health Center", "HC", "Level B", "GPS:5.6819,-0.1659"},
            {"Ga East District Hospital", "DH", "Level C", "GPS:5.6721,-0.1798"},
            {"Greater Accra Regional Hospital", "RH", "Level D", "GPS:5.5600,-0.2050"},
            {"Korle Bu Teaching Hospital", "TH", "Level E", "GPS:5.5364,-0.2279"},
        };

        // TODO: Implement referral letter builder with:
        //   Referring facility, receiving facility, date/time
        //   Patient demographics, NHIS number
        //   Reason for referral, clinical summary, vital signs
        //   Treatment given before referral
        //   Urgency level (Emergency/Urgent/Routine)
        // TODO: Find nearest appropriate facility based on:
        //   Required services (e.g., surgery, ICU, CT scan)
        //   Bed availability
        //   Distance/transport time
        // TODO: Generate counter-referral (feedback to referring facility)
        // TODO: Track referral outcomes (arrived? admitted? outcome?)
        // TODO: Calculate referral completion rate per facility

        System.out.println("Facilities in network: " + facilities.length);
        System.out.println("[TODO: Implement referral system]");
    }
}` }]
    },
    { id: 'proj-billing', name: 'P46: Hospital Billing Engine', icon: 'fa-receipt',
      mainClass: 'BillingEngine', files: [{ path: 'BillingEngine.java', content:
`public class BillingEngine {
    public static void main(String[] args) {
        System.out.println("=== Hospital Billing Engine ===\\n");

        // Patient encounter charges
        String[][] charges = {
            {"Consultation", "General OPD", "1", "50.00"},
            {"Lab - FBC", "Laboratory", "1", "35.00"},
            {"Lab - Malaria RDT", "Laboratory", "1", "15.00"},
            {"X-Ray Chest PA", "Radiology", "1", "80.00"},
            {"Amoxicillin 500mg", "Pharmacy", "21", "2.50"},
            {"Paracetamol 500mg", "Pharmacy", "12", "0.50"},
            {"IV Cannulation", "Nursing", "1", "20.00"},
            {"Normal Saline 1L", "Pharmacy", "2", "15.00"},
            {"Bed charge (per day)", "Ward", "3", "100.00"},
        };

        boolean nhisActive = true;
        double nhisCoverage = 0.80; // 80% covered

        // TODO: Calculate line item totals (quantity * unit price)
        // TODO: Calculate subtotal
        // TODO: Apply NHIS coverage if active
        // TODO: Calculate patient co-pay = total - NHIS portion
        // TODO: Apply exemptions (children < 18, pregnant women, elderly > 70)
        // TODO: Generate itemized bill with department subtotals
        // TODO: Track payments (paid/partial/outstanding)
        // TODO: Generate NHIS claims batch for submission

        System.out.println("Charge items: " + charges.length);
        System.out.println("[TODO: Implement billing engine]");
    }
}` }]
    },
    { id: 'proj-mortality-audit', name: 'P47: Maternal Mortality Audit', icon: 'fa-clipboard-check',
      mainClass: 'MaternalAudit', files: [{ path: 'MaternalAudit.java', content:
`public class MaternalAudit {
    public static void main(String[] args) {
        System.out.println("=== Maternal Death Audit & Review System ===");
        System.out.println("3-Delays Framework Analysis\\n");

        // Case data
        String name = "Case MDR-2024-015";
        int age = 29;
        int gravida = 4, parity = 3;
        int gestationalAge = 38;
        String causeOfDeath = "Postpartum hemorrhage";
        String directCause = "Uterine atony";

        // Timeline events
        String[][] timeline = {
            {"Day 0 06:00", "Onset of labor at home"},
            {"Day 0 14:00", "Family decided to go to health center (8h delay)"},
            {"Day 0 16:30", "Arrived health center, referred to district hospital"},
            {"Day 0 19:00", "Arrived district hospital (2.5h transport delay)"},
            {"Day 0 19:30", "Delivered by emergency C-section"},
            {"Day 0 20:00", "PPH started, uterine atony identified"},
            {"Day 0 20:15", "Oxytocin given, no response"},
            {"Day 0 20:45", "Blood bank called — no O-negative available"},
            {"Day 0 21:30", "Cross-matched blood arrived (45min delay)"},
            {"Day 0 22:00", "Patient deteriorating, DIC suspected"},
            {"Day 0 23:15", "Maternal death declared"},
        };

        // TODO: Analyze using WHO 3-Delays Framework:
        //   Delay 1: Decision to seek care (community factors)
        //   Delay 2: Reaching health facility (transport, distance)
        //   Delay 3: Receiving adequate care (facility capacity, supplies)
        // TODO: Identify each delay in the timeline
        // TODO: Calculate time intervals between critical events
        // TODO: Determine if death was preventable (YES/NO/UNCERTAIN)
        // TODO: Generate audit recommendations:
        //   Community: health education on danger signs
        //   Transport: ambulance service gaps
        //   Facility: blood bank readiness, staffing, protocols
        // TODO: Categorize contributing factors (medical, system, patient, community)

        System.out.println("Case: " + name);
        System.out.println("Cause: " + causeOfDeath + " due to " + directCause);
        System.out.println("\\n[TODO: Implement 3-delays analysis]");
    }
}` }]
    },
    { id: 'proj-nutrition', name: 'P48: Nutrition Assessment (MUAC)', icon: 'fa-apple-whole',
      mainClass: 'NutritionAssess', files: [{ path: 'NutritionAssess.java', content:
`public class NutritionAssess {
    public static void main(String[] args) {
        System.out.println("=== Pediatric Nutrition Assessment ===");
        System.out.println("MUAC + Weight-for-Height Z-Score\\n");

        System.out.print("Child name: "); String name = 0;  // Test value
        System.out.print("Age (months): "); int age = 0;  // Test value
        System.out.print("Sex (M/F): "); String sex = 0;  // Test value
        System.out.print("Weight (kg): "); double weight = 0.0;  // Test value
        System.out.print("Height/Length (cm): "); double height = 0.0;  // Test value
        System.out.print("MUAC (cm): "); double muac = 0.0;  // Test value
        System.out.print("Bilateral pitting edema? (Y/N): "); String edema = 0;  // Test value

        // TODO: MUAC classification (6-59 months):
        //   >= 12.5 cm: Normal (GREEN)
        //   11.5 - 12.4 cm: Moderate Acute Malnutrition (YELLOW)
        //   < 11.5 cm: Severe Acute Malnutrition (RED)
        // TODO: Weight-for-Height Z-score classification:
        //   >= -2 SD: Normal
        //   -3 to -2 SD: Moderate Acute Malnutrition (MAM)
        //   < -3 SD: Severe Acute Malnutrition (SAM)
        // TODO: If edema present: automatically SAM regardless of MUAC/WHZ
        // TODO: Treatment protocol:
        //   SAM with complications: inpatient therapeutic feeding (F75 then F100)
        //   SAM without complications: outpatient RUTF (Plumpy'Nut)
        //   MAM: supplementary feeding program
        //   Normal: growth monitoring, nutritional counseling
        // TODO: Calculate caloric needs: 100-200 kcal/kg/day for SAM recovery
        // TODO: Follow-up schedule and discharge criteria

        System.out.println("\\n[TODO: Implement nutrition assessment]");
        // Done
    }
}` }]
    },
    { id: 'proj-tb-screen', name: 'P49: TB Screening Cascade', icon: 'fa-lungs',
      mainClass: 'TBScreen', files: [{ path: 'TBScreen.java', content:
`public class TBScreen {
    public static void main(String[] args) {
        System.out.println("=== Tuberculosis Screening & Treatment Cascade ===\\n");

        String name = "Ama Darko";
        System.out.print("Age: "); int age = 0;  // Test value
        System.out.print("HIV status (P=positive, N=negative, U=unknown): "); String hiv = 0;  // Test value
        System.out.print("Cough >= 2 weeks? (Y/N): "); String cough = 0;  // Test value
        System.out.print("Fever? (Y/N): "); String fever = 0;  // Test value
        System.out.print("Night sweats? (Y/N): "); String sweats = 0;  // Test value
        System.out.print("Weight loss? (Y/N): "); String weightLoss = 0;  // Test value
        System.out.print("Contact with known TB case? (Y/N): "); String contact = 0;  // Test value

        // TODO: WHO TB symptom screen (any 1 of 4 = screen positive):
        //   Cough, fever, night sweats, weight loss
        //   For HIV+: ANY symptom = screen positive (lower threshold)
        // TODO: If screen positive → order GeneXpert MTB/RIF
        //   Results: MTB detected/not detected, Rifampicin resistant/sensitive
        // TODO: If GeneXpert positive:
        //   Rifampicin sensitive: Standard regimen (2RHZE/4RH)
        //   Rifampicin resistant: MDR-TB regimen → refer to MDR-TB center
        // TODO: Treatment phases:
        //   Intensive phase: 2 months RHZE (Rifampicin, Isoniazid, Pyrazinamide, Ethambutol)
        //   Continuation phase: 4 months RH
        // TODO: Weight-band dosing table for fixed-dose combinations
        // TODO: DOT (Directly Observed Therapy) schedule
        // TODO: Treatment outcome tracking: cured, completed, failed, died, LTFU
        // TODO: Contact tracing: list household contacts for screening

        System.out.println("\\n[TODO: Implement TB screening cascade]");
        // Done
    }
}` }]
    },
    { id: 'proj-capstone', name: 'P50: CAPSTONE — Hospital System', icon: 'fa-hospital',
      mainClass: 'HospitalSystem', files: [{ path: 'HospitalSystem.java', content:
`public class HospitalSystem {
    public static void main(String[] args) {
        System.out.println("╔══════════════════════════════════════════════╗");
        System.out.println("║    MEDJAVA CAPSTONE PROJECT                 ║");
        System.out.println("║    Integrated Hospital Information System   ║");
        System.out.println("╚══════════════════════════════════════════════╝\\n");

        System.out.println("This is your GRADUATION PROJECT, Dr. Agbesi.");
        System.out.println("Build a complete miniature Hospital Information System.\\n");

        System.out.println("=== MODULES TO IMPLEMENT ===");
        System.out.println("1. Patient Registration (OOP: Patient, Demographics)");
        System.out.println("2. OPD Queue Management (Priority Queue)");
        System.out.println("3. Clinical Notes / EMR (File I/O, Encryption)");
        System.out.println("4. Laboratory Orders & Results (HL7 messaging)");
        System.out.println("5. Pharmacy / Prescriptions (Drug interactions)");
        System.out.println("6. Billing & NHIS Claims (Financial logic)");
        System.out.println("7. Ward & Bed Management (Data structures)");
        System.out.println("8. Vital Signs Monitoring (Loops, alerts)");
        System.out.println("9. Appointment Scheduling (Date/Time handling)");
        System.out.println("10. Audit Trail & Security (Encryption, access control)");

        System.out.println("\\n=== REQUIREMENTS ===");
        System.out.println("- OOP design: Patient, Doctor, Nurse, Ward, Appointment classes");
        System.out.println("- Persistence: JSON file storage");
        System.out.println("- Security: AES encryption for sensitive fields");
        System.out.println("- Testing: JUnit tests for critical logic");
        System.out.println("- Interface: Command-line menu system");
        System.out.println("\\nStart by designing your class diagram.");
        System.out.println("Then implement one module at a time.");
        System.out.println("This IS the mountain. And you WILL climb it.");
    }
}` }]
    },
    // ===== HEALTH INFORMATICS & INNOVATION TIER: P51-P75 =====
    { id: 'proj-dhis2', name: 'P51: DHIS2 Data Pipeline', icon: 'fa-chart-pie',
      mainClass: 'DHIS2Pipeline', files: [{ path: 'DHIS2Pipeline.java', content:
`public class DHIS2Pipeline {
    public static void main(String[] args) {
        System.out.println("=== DHIS2 Health Data Pipeline ===");
        System.out.println("Ghana Health Service — District Health Information System\\n");

        // Monthly aggregate data from 5 health facilities
        // Format: {facilityCode, indicator, period, value}
        String[][] reportData = {
            {"GHS-0312", "OPD_ATTENDANCE_TOTAL", "2024-03", "1250"},
            {"GHS-0312", "MALARIA_CASES_CONFIRMED", "2024-03", "342"},
            {"GHS-0312", "ANC_FIRST_VISIT", "2024-03", "89"},
            {"GHS-0312", "DELIVERIES_FACILITY", "2024-03", "45"},
            {"GHS-0312", "UNDER5_DEATHS", "2024-03", "3"},
            {"GHS-0312", "IMMUNIZATION_PENTA3", "2024-03", "78"},
            {"GHS-0450", "OPD_ATTENDANCE_TOTAL", "2024-03", "890"},
            {"GHS-0450", "MALARIA_CASES_CONFIRMED", "2024-03", "210"},
            {"GHS-0450", "ANC_FIRST_VISIT", "2024-03", "62"},
            {"GHS-0450", "DELIVERIES_FACILITY", "2024-03", "31"},
            {"GHS-0450", "UNDER5_DEATHS", "2024-03", "1"},
            {"GHS-0450", "IMMUNIZATION_PENTA3", "2024-03", "55"},
        };

        // TODO Step 1: Parse and validate all data entries
        // TODO Step 2: Build DHIS2 dataValueSet JSON payload:
        //   { "dataSet":"MONTHLY_REPORT", "period":"202403",
        //     "orgUnit":"GHS-0312", "dataValues":[{dataElement,value},...] }
        // TODO Step 3: Aggregate across facilities for district-level totals
        // TODO Step 4: Calculate key indicators:
        //   - Malaria test positivity rate = confirmed / total tested * 100
        //   - Institutional delivery rate = facility deliveries / expected deliveries * 100
        //   - Penta3 coverage = Penta3 given / target population * 100
        //   - Under-5 mortality rate per 1000 live births
        // TODO Step 5: Compare to national targets (malaria <15%, Penta3 >90%, etc)
        // TODO Step 6: Generate district performance scorecard
        // TODO Step 7: Detect data quality issues (outliers, missing, impossible values)
        // TODO Step 8: Build 12-month trend analysis for each indicator

        System.out.println("Facilities: 2 | Data points: " + reportData.length);
        System.out.println("[TODO: Implement DHIS2 data pipeline]");
    }
}` }]
    },
    { id: 'proj-genomic', name: 'P52: Genomic Variant Analyzer', icon: 'fa-dna',
      mainClass: 'GenomicAnalyzer', files: [{ path: 'GenomicAnalyzer.java', content:
`public class GenomicAnalyzer {
    public static void main(String[] args) {
        System.out.println("=== Genomic Variant Analyzer ===");
        System.out.println("Pharmacogenomics for Personalized Medicine\\n");

        // Simulated VCF-style variant data
        // {chromosome, position, refAllele, altAllele, gene, rsID, zygosity}
        String[][] variants = {
            {"chr10", "96541616", "C", "T", "CYP2C19", "rs4244285", "heterozygous"},
            {"chr10", "96612495", "G", "A", "CYP2C19", "rs4986893", "homozygous_ref"},
            {"chr7",  "99361466", "A", "G", "CYP3A5",  "rs776746",  "homozygous_alt"},
            {"chr22", "42526694", "G", "A", "CYP2D6",  "rs3892097", "heterozygous"},
            {"chr16", "31107689", "C", "T", "VKORC1",  "rs9923231", "heterozygous"},
            {"chr12", "21178615", "T", "C", "SLCO1B1", "rs4149056", "homozygous_ref"},
            {"chr4",  "69964234", "G", "A", "UGT1A1",  "rs8175347", "heterozygous"},
        };

        // TODO Step 1: Parse each variant and determine star allele
        //   CYP2C19*2 (rs4244285 T) = loss of function → poor metabolizer
        //   CYP2C19*3 (rs4986893 A) = loss of function
        //   CYP3A5*3 (rs776746 G) = non-expressor (most common in Africans)
        //   CYP2D6*4 (rs3892097 A) = loss of function
        //   VKORC1 -1639G>A = warfarin sensitivity
        //   SLCO1B1*5 (rs4149056 C) = statin myopathy risk
        // TODO Step 2: Determine metabolizer phenotype for each gene:
        //   Extensive (normal), Intermediate, Poor, Ultra-rapid
        // TODO Step 3: Generate drug recommendations:
        //   CYP2C19 poor metabolizer → avoid clopidogrel, use ticagrelor
        //   CYP2D6 poor metabolizer → avoid codeine (no conversion to morphine)
        //   VKORC1 variant → reduce warfarin starting dose by 25-50%
        //   SLCO1B1*5 → avoid simvastatin >20mg, use rosuvastatin
        // TODO Step 4: Africa-specific pharmacogenomics:
        //   CYP2D6 ultra-rapid metabolizers more common in East Africa
        //   CYP2B6 variants affect efavirenz (HIV drug) metabolism
        //   G6PD deficiency screening before primaquine (malaria)
        // TODO Step 5: Generate pharmacogenomic passport (summary card)

        System.out.println("Variants analyzed: " + variants.length);
        System.out.println("[TODO: Implement pharmacogenomic analysis]");
    }
}` }]
    },
    { id: 'proj-drug-design', name: 'P53: Drug Molecule Screener', icon: 'fa-flask-vial',
      mainClass: 'DrugScreener', files: [{ path: 'DrugScreener.java', content:
`public class DrugScreener {
    public static void main(String[] args) {
        System.out.println("=== Virtual Drug Screening Engine ===");
        System.out.println("Lipinski's Rule of Five + ADMET Prediction\\n");

        // Candidate drug molecules
        // {name, molecularWeight, logP, hBondDonors, hBondAcceptors, rotBonds, TPSA, formula}
        String[][] candidates = {
            {"MedJ-001", "285.34", "2.1", "2", "4", "3", "63.5", "C15H19NO4"},
            {"MedJ-002", "512.67", "5.8", "4", "8", "9", "120.3", "C28H32N4O6"},
            {"MedJ-003", "198.22", "0.8", "1", "3", "1", "46.2", "C9H10N2O3"},
            {"MedJ-004", "623.81", "6.2", "6", "12", "14", "185.7", "C32H41N5O8"},
            {"MedJ-005", "342.45", "3.1", "2", "5", "4", "78.9", "C18H22N2O4S"},
            {"MedJ-006", "156.18", "-0.5", "3", "4", "0", "86.1", "C6H8N2O3"},
            {"MedJ-007", "445.52", "4.5", "1", "6", "6", "55.8", "C24H27NO5F2"},
        };

        // TODO Step 1: Apply Lipinski's Rule of Five (oral bioavailability filter):
        //   MW <= 500, logP <= 5, HBD <= 5, HBA <= 10
        //   Violations >= 2 → likely poor oral absorption → REJECT
        // TODO Step 2: Apply Veber's rules (oral bioavailability):
        //   Rotatable bonds <= 10, TPSA <= 140 Å²
        // TODO Step 3: Apply Ghose filter (drug-likeness):
        //   MW 160-480, logP -0.4 to 5.6, atoms 20-70, refractivity 40-130
        // TODO Step 4: Predict ADMET properties:
        //   Absorption: Caco-2 permeability estimate from TPSA
        //   Distribution: Blood-brain barrier penetration (TPSA < 90 → likely CNS active)
        //   Metabolism: Flag if contains known CYP substrate motifs
        //   Excretion: Estimate renal vs hepatic based on logP
        //   Toxicity: Flag PAINS (Pan-Assay Interference) substructures
        // TODO Step 5: Rank candidates by drug-likeness score
        // TODO Step 6: Generate lead optimization suggestions:
        //   "Reduce MW by removing methyl groups"
        //   "Increase solubility by adding hydroxyl group"
        // TODO Step 7: Compare to known approved drug property distributions

        System.out.println("Candidates to screen: " + candidates.length);
        System.out.println("[TODO: Implement drug screening pipeline]");
    }
}` }]
    },
    { id: 'proj-protein-dock', name: 'P54: Protein Binding Scorer', icon: 'fa-virus',
      mainClass: 'BindingScorer', files: [{ path: 'BindingScorer.java', content:
`public class BindingScorer {
    public static void main(String[] args) {
        System.out.println("=== Protein-Ligand Binding Affinity Scorer ===");
        System.out.println("Simplified Molecular Docking Simulation\\n");

        // Target protein: ACE2 receptor (COVID-19 relevant)
        // Binding site residues with their properties
        // {residueName, position, charge, hydrophobicity, hBondCapacity}
        String[][] bindingSite = {
            {"LYS", "31", "+1", "low", "donor"},
            {"ASP", "38", "-1", "low", "acceptor"},
            {"TYR", "41", "0", "medium", "both"},
            {"GLN", "42", "0", "low", "both"},
            {"LEU", "45", "0", "high", "none"},
            {"MET", "82", "0", "high", "none"},
            {"TYR", "83", "0", "medium", "both"},
            {"ASN", "330", "0", "low", "both"},
            {"GLY", "354", "0", "low", "donor"},
            {"ASP", "355", "-1", "low", "acceptor"},
        };

        // Candidate ligand features at interaction points
        // {atomType, charge, canDonate, canAccept, hydrophobic}
        String[][] ligandFeatures = {
            {"NH3+", "+1", "true", "false", "false"},
            {"COO-", "-1", "false", "true", "false"},
            {"OH", "0", "true", "true", "false"},
            {"CH3", "0", "false", "false", "true"},
            {"C=O", "0", "false", "true", "false"},
        };

        // TODO Step 1: Calculate electrostatic complementarity score:
        //   Opposite charges attract (+1 to -1 = +2 score)
        //   Same charges repel (+1 to +1 = -2 penalty)
        // TODO Step 2: Calculate hydrogen bond score:
        //   Donor-acceptor pair = +1.5 per H-bond
        //   Maximum 2 H-bonds per residue
        // TODO Step 3: Calculate hydrophobic packing score:
        //   Hydrophobic ligand atom near hydrophobic residue = +1.0
        //   Hydrophobic atom in polar environment = -0.5 (desolvation penalty)
        // TODO Step 4: Calculate shape complementarity (simplified):
        //   Count matched interaction pairs / total possible
        // TODO Step 5: Combine scores with weights:
        //   Total = 0.4*electrostatic + 0.3*hbond + 0.2*hydrophobic + 0.1*shape
        // TODO Step 6: Convert to estimated binding free energy (ΔG):
        //   ΔG ≈ -RT * ln(Ka) → approximate from score
        //   ΔG < -7 kcal/mol → strong binding → promising drug candidate
        // TODO Step 7: Compare multiple candidate ligands and rank

        System.out.println("Binding site residues: " + bindingSite.length);
        System.out.println("[TODO: Implement binding affinity scoring]");
    }
}` }]
    },
    { id: 'proj-clinical-trial', name: 'P55: Clinical Trial Engine', icon: 'fa-clipboard-list',
      mainClass: 'ClinicalTrialEngine', files: [{ path: 'ClinicalTrialEngine.java', content:
`public class ClinicalTrialEngine {
    public static void main(String[] args) {
        System.out.println("=== Clinical Trial Data Management System ===");
        System.out.println("Phase III Randomized Controlled Trial Simulator\\n");

        // Trial: Testing new antimalarial drug "MedJ-Artem" vs standard ACT
        String trialName = "MEDJ-MAL-2024 Phase III";
        int targetEnrollment = 200;
        double randomizationRatio = 0.5; // 1:1

        // Enrolled participants
        // {subjectID, arm, age, weight, baselineParasitemia, day0, day3, day7, day14, day28, adverseEvent}
        String[][] participants = {
            {"S001", "TREATMENT", "28", "65", "45000", "45000", "1200", "0", "0", "0", "none"},
            {"S002", "CONTROL",   "34", "72", "38000", "38000", "800",  "0", "0", "250", "none"},
            {"S003", "TREATMENT", "22", "55", "92000", "92000", "5000", "200","0", "0", "headache"},
            {"S004", "CONTROL",   "45", "80", "28000", "28000", "2000", "500","0", "0", "nausea"},
            {"S005", "TREATMENT", "31", "68", "56000", "56000", "0",    "0", "0", "0", "none"},
            {"S006", "CONTROL",   "38", "75", "41000", "41000", "3500", "800","200","0","vomiting"},
            {"S007", "TREATMENT", "26", "58", "78000", "78000", "2200", "0", "0", "0", "dizziness"},
            {"S008", "CONTROL",   "42", "70", "33000", "33000", "1500", "400","0", "350","none"},
        };

        // TODO Step 1: Verify randomization balance (equal arms, similar demographics)
        // TODO Step 2: Calculate primary endpoint — Day 28 cure rate per arm:
        //   Cured = parasitemia = 0 at day 28
        //   Treatment failure = parasitemia > 0 at day 28 (recrudescence)
        // TODO Step 3: Calculate parasite clearance time (first day parasitemia = 0)
        // TODO Step 4: Kaplan-Meier survival analysis (time to treatment failure)
        // TODO Step 5: Calculate Relative Risk = (failure_treatment/n_treatment) / (failure_control/n_control)
        //   RR < 1 = new drug better, RR > 1 = standard better
        // TODO Step 6: Calculate Number Needed to Treat (NNT) = 1 / absolute risk reduction
        // TODO Step 7: Adverse event frequency table by arm
        // TODO Step 8: Chi-square test for significance (p < 0.05)
        // TODO Step 9: Generate CONSORT flow diagram data
        // TODO Step 10: Data Safety Monitoring Board (DSMB) interim analysis:
        //   Stop for efficacy if p < 0.001
        //   Stop for futility if conditional power < 10%
        //   Stop for safety if serious AE rate > 15%

        System.out.println("Trial: " + trialName);
        System.out.println("Participants: " + participants.length + " / " + targetEnrollment);
        System.out.println("[TODO: Implement clinical trial engine]");
    }
}` }]
    },
    { id: 'proj-syndromic', name: 'P56: Syndromic Surveillance AI', icon: 'fa-satellite-dish',
      mainClass: 'SyndromicSurveillance', files: [{ path: 'SyndromicSurveillance.java', content:
`public class SyndromicSurveillance {
    public static void main(String[] args) {
        System.out.println("=== Real-Time Syndromic Surveillance System ===");
        System.out.println("AI-Powered Outbreak Early Warning\\n");

        // Incoming OPD presentations (simulated real-time stream)
        // {timestamp, facilityCode, age, sex, chiefComplaint, syndrome, geoZone}
        String[][] presentations = {
            {"2024-03-15 08:12", "GHS-0312", "4", "M", "watery diarrhea 10x/day", "ACUTE_WATERY_DIARRHEA", "ZONE_A"},
            {"2024-03-15 08:30", "GHS-0312", "6", "F", "vomiting and watery stool", "ACUTE_WATERY_DIARRHEA", "ZONE_A"},
            {"2024-03-15 09:00", "GHS-0450", "3", "M", "severe diarrhea, sunken eyes", "ACUTE_WATERY_DIARRHEA", "ZONE_A"},
            {"2024-03-15 09:15", "GHS-0312", "45", "F", "cough, fever, body aches", "INFLUENZA_LIKE_ILLNESS", "ZONE_B"},
            {"2024-03-15 09:30", "GHS-0312", "8", "M", "profuse watery diarrhea", "ACUTE_WATERY_DIARRHEA", "ZONE_A"},
            {"2024-03-15 09:45", "GHS-0450", "2", "F", "diarrhea, dehydration", "ACUTE_WATERY_DIARRHEA", "ZONE_A"},
            {"2024-03-15 10:00", "GHS-0312", "32", "M", "high fever, headache, joint pain", "ACUTE_FEBRILE_ILLNESS", "ZONE_C"},
            {"2024-03-15 10:15", "GHS-0312", "5", "M", "rice-water stool, vomiting", "ACUTE_WATERY_DIARRHEA", "ZONE_A"},
            {"2024-03-15 10:30", "GHS-0450", "28", "F", "watery diarrhea, cramps", "ACUTE_WATERY_DIARRHEA", "ZONE_A"},
            {"2024-03-15 10:45", "GHS-0600", "55", "M", "fever, cough, night sweats", "INFLUENZA_LIKE_ILLNESS", "ZONE_D"},
        };

        // Baseline rates (average daily presentations per syndrome per zone)
        // {syndrome, zone, baseline_daily_average}
        String[][] baselines = {
            {"ACUTE_WATERY_DIARRHEA", "ZONE_A", "1.5"},
            {"ACUTE_WATERY_DIARRHEA", "ZONE_B", "0.8"},
            {"INFLUENZA_LIKE_ILLNESS", "ZONE_B", "2.0"},
            {"ACUTE_FEBRILE_ILLNESS", "ZONE_C", "3.0"},
        };

        // TODO Step 1: Aggregate presentations by syndrome + zone + time window (6h rolling)
        // TODO Step 2: Calculate observed/expected ratio for each syndrome-zone pair
        //   Alert threshold: observed > 2x baseline in a 6-hour window
        // TODO Step 3: Apply CUSUM algorithm (cumulative sum) for trend detection:
        //   S(n) = max(0, S(n-1) + (x_n - k))  where k = baseline + 0.5*sigma
        //   Alert when S(n) > h (decision interval, typically 4-5 sigma)
        // TODO Step 4: Spatial clustering detection:
        //   Multiple facilities in same zone reporting same syndrome = spatial cluster
        // TODO Step 5: Age-group analysis (< 5 years cluster = different concern than adult)
        // TODO Step 6: Auto-classify syndrome pattern:
        //   Acute watery diarrhea cluster in children + same zone = CHOLERA ALERT
        //   Acute febrile illness cluster = consider dengue, yellow fever, meningitis
        // TODO Step 7: Generate automated alert SMS/notification:
        //   "ALERT: 7 cases of acute watery diarrhea in Zone A within 3 hours.
        //    Possible cholera outbreak. Initiate sample collection and case management."
        // TODO Step 8: Predict next 24h case count using exponential smoothing

        System.out.println("Presentations in stream: " + presentations.length);
        System.out.println("[TODO: Implement syndromic surveillance engine]");
    }
}` }]
    },
    { id: 'proj-ai-triage', name: 'P57: AI Symptom Triage Engine', icon: 'fa-robot',
      mainClass: 'AITriageEngine', files: [{ path: 'AITriageEngine.java', content:
`public class AITriageEngine {
    public static void main(String[] args) {
        System.out.println("=== AI-Powered Symptom Checker & Triage ===");
        System.out.println("Bayesian Differential Diagnosis Engine\\n");

        System.out.print("Patient age: "); int age = 0;  // Test value
        System.out.print("Sex (M/F): "); String sex = 0;  // Test value

        // Symptom input (1=present, 0=absent)
        System.out.println("\\nAnswer 1 (yes) or 0 (no) for each symptom:");
        System.out.print("Fever: "); int fever = 0;  // Test value
        System.out.print("Cough: "); int cough = 0;  // Test value
        System.out.print("Chest pain: "); int chestPain = 0;  // Test value
        System.out.print("Shortness of breath: "); int sob = 0;  // Test value
        System.out.print("Headache: "); int headache = 0;  // Test value
        System.out.print("Abdominal pain: "); int abdPain = 0;  // Test value
        System.out.print("Diarrhea: "); int diarrhea = 0;  // Test value
        System.out.print("Rash: "); int rash = 0;  // Test value
        System.out.print("Joint pain: "); int jointPain = 0;  // Test value
        System.out.print("Vomiting: "); int vomiting = 0;  // Test value

        // Disease-symptom probability matrix (simplified Bayesian network)
        // {disease, prevalence, P(fever), P(cough), P(chestPain), P(sob), P(headache),
        //  P(abdPain), P(diarrhea), P(rash), P(jointPain), P(vomiting)}
        double[][] diseaseModel = {
            // Malaria
            {0.15, 0.95, 0.10, 0.05, 0.05, 0.80, 0.15, 0.10, 0.05, 0.40, 0.30},
            // Pneumonia
            {0.08, 0.85, 0.90, 0.40, 0.60, 0.30, 0.05, 0.05, 0.05, 0.05, 0.10},
            // Typhoid
            {0.05, 0.90, 0.15, 0.05, 0.05, 0.70, 0.50, 0.30, 0.15, 0.10, 0.20},
            // Dengue
            {0.03, 0.95, 0.10, 0.10, 0.05, 0.80, 0.20, 0.05, 0.50, 0.80, 0.30},
            // Gastroenteritis
            {0.10, 0.40, 0.05, 0.05, 0.05, 0.15, 0.80, 0.90, 0.05, 0.05, 0.70},
            // COVID-19
            {0.04, 0.70, 0.80, 0.15, 0.40, 0.50, 0.10, 0.15, 0.05, 0.20, 0.15},
            // Meningitis
            {0.01, 0.90, 0.05, 0.05, 0.10, 0.95, 0.10, 0.05, 0.30, 0.10, 0.60},
            // Appendicitis
            {0.02, 0.50, 0.05, 0.05, 0.05, 0.10, 0.95, 0.10, 0.05, 0.05, 0.70},
        };
        String[] diseaseNames = {"Malaria", "Pneumonia", "Typhoid", "Dengue",
                                  "Gastroenteritis", "COVID-19", "Meningitis", "Appendicitis"};

        // TODO Step 1: For each disease, calculate P(Disease | Symptoms) using Bayes theorem:
        //   P(D|S) ∝ P(D) * ∏ P(Si|D) for present symptoms * ∏ (1-P(Si|D)) for absent
        // TODO Step 2: Normalize probabilities so they sum to 1
        // TODO Step 3: Rank diseases by posterior probability
        // TODO Step 4: Flag RED if top diagnosis is life-threatening (meningitis, appendicitis)
        // TODO Step 5: Suggest next best question to ask (information gain):
        //   Find the symptom not yet asked that would most change the ranking
        // TODO Step 6: Recommend triage level:
        //   > 30% probability of emergency condition → EMERGENCY
        //   Top diagnosis treatable in OPD → ROUTINE
        // TODO Step 7: Suggest confirmatory tests for top 3 diagnoses
        // TODO Step 8: Ghana-specific: adjust prevalence by season (malaria peaks in rainy season)

        System.out.println("\\n[TODO: Implement Bayesian diagnosis engine]");
        // Done
    }
}` }]
    },
    { id: 'proj-digital-twin', name: 'P58: Patient Digital Twin', icon: 'fa-user-astronaut',
      mainClass: 'DigitalTwin', files: [{ path: 'DigitalTwin.java', content:
`public class DigitalTwin {
    public static void main(String[] args) {
        System.out.println("=== Patient Digital Twin Simulator ===");
        System.out.println("Predictive Physiological Model\\n");

        // Patient baseline state
        String name = "Ama Darko";
        int age = 45;
        double weight = 70; // kg
        double height = 165; // cm

        // Current physiological state
        double heartRate = 78;        // bpm
        double systolicBP = 138;      // mmHg
        double diastolicBP = 88;      // mmHg
        double bloodGlucose = 180;    // mg/dL (pre-diabetic)
        double hba1c = 7.2;           // %
        double creatinine = 1.1;      // mg/dL
        double cholesterol = 245;     // mg/dL (total)
        double ldl = 160;             // mg/dL
        double bmi = weight / ((height/100) * (height/100));

        // Medications
        String[] currentMeds = {"Metformin 500mg BD", "Amlodipine 5mg OD", "Atorvastatin 20mg ON"};

        // TODO Step 1: Build physiological compartment model:
        //   Glucose compartment: intake → blood → cells (insulin-mediated)
        //   BP compartment: cardiac output * peripheral resistance
        //   Lipid compartment: dietary intake → liver → blood → tissues
        // TODO Step 2: Simulate 30-day trajectory WITHOUT medication changes:
        //   Project glucose, BP, cholesterol trends
        // TODO Step 3: Simulate intervention scenarios:
        //   Scenario A: Increase Metformin to 1000mg BD → project glucose reduction
        //   Scenario B: Add exercise 30min/day → project BP and glucose changes
        //   Scenario C: Switch Atorvastatin to 40mg → project LDL reduction
        //   Scenario D: No changes → project 1-year cardiovascular risk
        // TODO Step 4: Calculate 10-year cardiovascular risk (Framingham score):
        //   Input: age, sex, total cholesterol, HDL, systolic BP, smoking, diabetes
        //   Output: % risk of heart attack or stroke in 10 years
        // TODO Step 5: Compare twin trajectories side by side
        // TODO Step 6: Generate recommendation: "Increasing Metformin + adding exercise
        //   is predicted to reduce HbA1c by 1.2% and cardiovascular risk by 15%"
        // TODO Step 7: Sensitivity analysis — which parameter changes matter most?

        System.out.println("Digital Twin: " + name);
        System.out.println("BMI: " + String.format("%.1f", bmi));
        System.out.println("CV Risk Factors: hypertension, pre-diabetes, dyslipidemia");
        System.out.println("[TODO: Implement digital twin simulation]");
    }
}` }]
    },
    { id: 'proj-nlp-notes', name: 'P59: Clinical Notes NLP', icon: 'fa-file-medical',
      mainClass: 'ClinicalNLP', files: [{ path: 'ClinicalNLP.java', content:
`public class ClinicalNLP {
    public static void main(String[] args) {
        System.out.println("=== Clinical Notes NLP Processor ===");
        System.out.println("Extract Structured Data from Free Text\\n");

        String clinicalNote = "Mrs. Ama Darko, 45F, presents with 3-day history of worsening "
            + "headache and blurred vision. BP 178/105 mmHg. She reports missing her Amlodipine "
            + "for the past week due to stock-out at her pharmacy. Has known HTN x 5 years and "
            + "DM type 2 on Metformin 500mg BD. Fundoscopy shows grade 2 hypertensive retinopathy. "
            + "FBS 210 mg/dL, Creatinine 1.4 mg/dL (up from 1.1 last month). "
            + "Assessment: Hypertensive urgency with target organ damage (retinopathy, nephropathy). "
            + "Plan: Admit, IV Labetalol, resume Amlodipine, add Losartan 50mg, "
            + "renal ultrasound, ophthalmology consult.";

        System.out.println("Clinical Note:");
        System.out.println(clinicalNote);
        System.out.println("\\n" + "=".repeat(50));

        // TODO Step 1: Extract patient demographics: name, age, sex
        // TODO Step 2: Extract vital signs using regex patterns:
        //   BP pattern: (\\d{2,3})/(\\d{2,3})\\s*mmHg
        //   Temperature: (\\d{2}\\.\\d)\\s*°?C
        //   Heart rate: (\\d{2,3})\\s*bpm
        // TODO Step 3: Extract medications with doses:
        //   Pattern: drug_name + dose + frequency (BD, OD, TDS, QID)
        // TODO Step 4: Extract diagnoses using ICD-10 keyword mapping:
        //   "HTN" / "hypertension" → I10
        //   "DM type 2" / "diabetes" → E11
        //   "retinopathy" → H35.0
        // TODO Step 5: Extract lab results: test_name + value + unit
        // TODO Step 6: Detect negations: "no fever", "denies chest pain"
        // TODO Step 7: Extract temporal information: "3-day history", "past week", "x 5 years"
        // TODO Step 8: Build structured FHIR-compatible output:
        //   Condition resources, MedicationStatement, Observation
        // TODO Step 9: Flag medication adherence issues ("missing", "stopped", "ran out")
        // TODO Step 10: Auto-generate problem list from extracted data

        System.out.println("\\n[TODO: Implement clinical NLP pipeline]");
    }
}` }]
    },
    { id: 'proj-predict-readmit', name: 'P60: Readmission Risk Predictor', icon: 'fa-rotate-left',
      mainClass: 'ReadmissionPredictor', files: [{ path: 'ReadmissionPredictor.java', content:
`public class ReadmissionPredictor {
    public static void main(String[] args) {
        System.out.println("=== 30-Day Hospital Readmission Risk Predictor ===");
        System.out.println("LACE+ Index + Machine Learning Enhancement\\n");

        // Patient data at discharge
        // {patientID, lengthOfStay, acuityAtAdmit(E=emerg,U=urgent,R=routine),
        //  comorbidityScore, edVisitsLast6mo, age, livesAlone, numMeds, diagGroup}
        String[][] patients = {
            {"P001", "8", "E", "4", "2", "72", "1", "12", "HEART_FAILURE"},
            {"P002", "3", "R", "1", "0", "45", "0", "4", "APPENDECTOMY"},
            {"P003", "12", "E", "6", "4", "68", "1", "15", "COPD_EXACERBATION"},
            {"P004", "5", "U", "3", "1", "55", "0", "8", "PNEUMONIA"},
            {"P005", "2", "R", "0", "0", "28", "0", "2", "NORMAL_DELIVERY"},
            {"P006", "15", "E", "7", "3", "78", "1", "18", "STROKE"},
            {"P007", "4", "U", "2", "1", "62", "0", "9", "DIABETES_DKA"},
            {"P008", "6", "E", "5", "2", "70", "1", "14", "HEART_FAILURE"},
        };

        // TODO Step 1: Calculate LACE index for each patient:
        //   L = Length of stay (1-4=0, 5-6=2, 7-13=4, 14+=7)
        //   A = Acuity of admission (Emergency=3, Urgent=2, Routine=0)
        //   C = Comorbidity (Charlson index 0=0, 1-3=3, >=4=5)
        //   E = ED visits in past 6 months (0=0, 1=1, 2=2, 3=3, >=4=4)
        // TODO Step 2: Classify risk: LACE < 5 = low, 5-9 = medium, >= 10 = high
        // TODO Step 3: Add social determinants bonus risk:
        //   Lives alone +2, >10 medications +2, age >75 +1
        // TODO Step 4: Disease-specific adjustment:
        //   Heart failure: +3 (highest readmission rates nationally)
        //   COPD: +2, Stroke: +2
        // TODO Step 5: Build logistic regression model:
        //   P(readmit) = 1 / (1 + exp(-(b0 + b1*L + b2*A + b3*C + b4*E + ...)))
        // TODO Step 6: Rank patients by readmission risk
        // TODO Step 7: Generate targeted interventions per risk level:
        //   High: discharge nurse follow-up within 48h, medication reconciliation
        //   Medium: telehealth check at 7 days, pharmacy review
        //   Low: standard discharge with instructions
        // TODO Step 8: Calculate expected cost savings from prevention

        System.out.println("Patients at discharge: " + patients.length);
        System.out.println("[TODO: Implement readmission predictor]");
    }
}` }]
    },
    { id: 'proj-wearable', name: 'P61: Wearable Data Fusion', icon: 'fa-watch',
      mainClass: 'WearableFusion', files: [{ path: 'WearableFusion.java', content:
`public class WearableFusion {
    public static void main(String[] args) {
        System.out.println("=== Multi-Sensor Wearable Health Data Fusion ===");
        System.out.println("Real-Time Anomaly Detection from Smartwatch Data\\n");

        // 24-hour continuous data stream (sampled every 5 minutes = 288 readings)
        // Simulated subset of key readings
        // {timestamp, heartRate, steps5min, spo2, skinTemp, hrv_rmssd, sleepStage}
        String[][] sensorData = {
            {"00:00", "62", "0",   "97", "36.2", "45", "DEEP"},
            {"00:30", "58", "0",   "96", "36.1", "52", "DEEP"},
            {"01:00", "55", "0",   "97", "36.0", "55", "REM"},
            {"03:00", "60", "0",   "96", "36.1", "48", "LIGHT"},
            {"06:00", "72", "0",   "97", "36.3", "38", "AWAKE"},
            {"07:00", "85", "450", "98", "36.5", "32", "AWAKE"},
            {"09:00", "95", "800", "98", "36.7", "28", "AWAKE"},
            {"12:00", "78", "200", "97", "36.6", "35", "AWAKE"},
            {"14:00", "110","50",  "95", "37.2", "18", "AWAKE"},  // anomaly?
            {"14:30", "125","20",  "93", "37.5", "12", "AWAKE"},  // anomaly!
            {"15:00", "108","30",  "94", "37.3", "15", "AWAKE"},  // recovering?
            {"18:00", "82", "350", "97", "36.5", "30", "AWAKE"},
            {"21:00", "70", "50",  "97", "36.3", "40", "AWAKE"},
            {"23:00", "64", "0",   "97", "36.2", "44", "LIGHT"},
        };

        // TODO Step 1: Build personal baseline model:
        //   Resting HR (sleeping average), active HR range, normal SpO2, normal skin temp
        // TODO Step 2: Detect anomalies using Z-score method:
        //   Z = (value - personal_mean) / personal_SD
        //   |Z| > 2 = mild anomaly, |Z| > 3 = severe anomaly
        // TODO Step 3: Multi-sensor correlation analysis:
        //   High HR + Low SpO2 + High temp = potential infection/sepsis
        //   High HR + Low HRV + normal SpO2 = stress/anxiety
        //   Low HR + Low HRV = potential cardiac event
        //   High HR + high steps = normal exercise (not anomaly)
        // TODO Step 4: Context-aware filtering:
        //   Don't alert during exercise (steps > 200/5min)
        //   Weight nighttime readings differently (lower thresholds)
        // TODO Step 5: Calculate daily health score (0-100):
        //   Sleep quality, resting HR trend, activity level, SpO2 stability
        // TODO Step 6: Trend analysis over 7 days:
        //   Gradually increasing resting HR = possible developing illness
        //   Decreasing HRV trend = declining autonomic health
        // TODO Step 7: Generate alert with confidence level:
        //   "HIGH CONFIDENCE: Possible febrile episode at 14:00-15:00.
        //    HR elevated 40% above baseline, SpO2 dropped to 93%, temp +1°C.
        //    Recommend: check temperature, consider medical consultation."

        System.out.println("Sensor readings: " + sensorData.length);
        System.out.println("[TODO: Implement wearable data fusion engine]");
    }
}` }]
    },
    { id: 'proj-blockchain-med', name: 'P62: Medical Record Chain', icon: 'fa-link',
      mainClass: 'MedRecordChain', files: [{ path: 'MedRecordChain.java', content:
`public class MedRecordChain {
    public static void main(String[] args) {
        System.out.println("=== Blockchain-Inspired Medical Record Integrity System ===");
        System.out.println("Tamper-Proof Audit Trail for Patient Data\\n");

        // TODO Step 1: Define a Block class:
        //   index, timestamp, data (medical event), previousHash, hash, nonce
        // TODO Step 2: Implement SHA-256 hash function:
        //   hash = SHA256(index + timestamp + data + previousHash + nonce)
        // TODO Step 3: Create genesis block (first block in chain)
        // TODO Step 4: Add medical events as new blocks:
        //   "Patient admitted: Ama Darko, Ward 3, Bed 5"
        //   "Lab ordered: FBC, MP, RBS"
        //   "Lab result: MP Positive, Parasite count 45,000/uL"
        //   "Treatment: IV Artesunate 2.4mg/kg started"
        //   "Vital signs: T39.2, HR110, BP100/65, SpO2 96%"
        //   "Consultation: Dr. Mensah reviewed case"
        //   "Discharge: Patient improved, oral ACT to complete"
        // TODO Step 5: Validate chain integrity:
        //   Each block's previousHash must match actual hash of previous block
        //   Detect if any block has been tampered with
        // TODO Step 6: Simulate tampering: modify a middle block's data
        //   → Chain validation should FAIL and identify the tampered block
        // TODO Step 7: Implement simple proof-of-work (find hash starting with "00")
        // TODO Step 8: Access control log: who viewed which block, when
        // TODO Step 9: Generate integrity report: "Chain verified: 7 blocks, no tampering detected"

        System.out.println("[TODO: Implement medical record blockchain]");
    }
}` }]
    },
    { id: 'proj-health-equity', name: 'P63: Health Equity Analyzer', icon: 'fa-scale-balanced',
      mainClass: 'HealthEquity', files: [{ path: 'HealthEquity.java', content:
`public class HealthEquity {
    public static void main(String[] args) {
        System.out.println("=== Health Equity & Disparity Analyzer ===");
        System.out.println("WHO Social Determinants of Health Framework\\n");

        // District-level health data for Ghana (10 districts)
        // {district, region, population, under5Mortality, maternalMortality,
        //  doctorsPer10k, bedsPer10k, NHISCoverage%, povertyRate%, urbanization%}
        String[][] districts = {
            {"Accra Metro",      "Greater Accra", "2000000", "32", "120", "2.5", "15", "78", "10", "95"},
            {"Kumasi Metro",     "Ashanti",       "1500000", "38", "150", "1.8", "12", "72", "15", "90"},
            {"Tamale Metro",     "Northern",      "400000",  "55", "280", "0.5", "5",  "45", "45", "60"},
            {"Wa Municipal",     "Upper West",    "120000",  "68", "350", "0.3", "3",  "38", "55", "40"},
            {"Bolgatanga",       "Upper East",    "150000",  "62", "310", "0.4", "4",  "42", "50", "35"},
            {"Cape Coast Metro", "Central",       "200000",  "42", "180", "1.2", "8",  "65", "25", "75"},
            {"Sunyani",          "Bono",          "180000",  "45", "200", "0.8", "6",  "58", "30", "55"},
            {"Ho Municipal",     "Volta",         "170000",  "48", "220", "0.6", "5",  "52", "35", "50"},
            {"Koforidua",        "Eastern",       "200000",  "40", "170", "1.0", "7",  "62", "22", "65"},
            {"Sekondi-Takoradi", "Western",       "300000",  "35", "140", "1.5", "10", "70", "18", "80"},
        };

        // TODO Step 1: Calculate health equity indices:
        //   Gini coefficient for doctor distribution
        //   Concentration index for mortality vs poverty
        // TODO Step 2: Identify worst-performing districts per indicator
        // TODO Step 3: Calculate absolute and relative disparities:
        //   Absolute gap = worst - best
        //   Relative gap = worst / best ratio
        // TODO Step 4: Correlation analysis: poverty vs mortality, doctors vs mortality
        // TODO Step 5: Calculate resource allocation needed to achieve equity:
        //   "Tamale needs 8 more doctors to reach national average"
        //   "Upper West needs 45% increase in NHIS coverage"
        // TODO Step 6: Predict impact of interventions:
        //   Adding 1 doctor per 10k → estimated mortality reduction of X%
        // TODO Step 7: Generate equity dashboard with rankings
        // TODO Step 8: SDG 3 progress tracking (Universal Health Coverage index)

        System.out.println("Districts analyzed: " + districts.length);
        System.out.println("[TODO: Implement health equity analyzer]");
    }
}` }]
    },
    { id: 'proj-antimicrobial', name: 'P64: AMR Resistance Tracker', icon: 'fa-shield-virus',
      mainClass: 'AMRTracker', files: [{ path: 'AMRTracker.java', content:
`public class AMRTracker {
    public static void main(String[] args) {
        System.out.println("=== Antimicrobial Resistance (AMR) Surveillance ===");
        System.out.println("Antibiogram Builder + Resistance Trend Analyzer\\n");

        // Culture & sensitivity results from microbiology lab
        // {isolateID, organism, specimen, antibiotic, result(S/I/R), MIC}
        String[][] cultureResults = {
            {"ISO001", "E. coli",         "urine", "Ampicillin",     "R", ">32"},
            {"ISO001", "E. coli",         "urine", "Ciprofloxacin",  "S", "0.25"},
            {"ISO001", "E. coli",         "urine", "Ceftriaxone",    "S", "0.5"},
            {"ISO001", "E. coli",         "urine", "Meropenem",      "S", "0.06"},
            {"ISO002", "S. aureus",       "wound", "Penicillin",     "R", ">16"},
            {"ISO002", "S. aureus",       "wound", "Oxacillin",      "R", ">4"},
            {"ISO002", "S. aureus",       "wound", "Vancomycin",     "S", "1"},
            {"ISO002", "S. aureus",       "wound", "Clindamycin",    "S", "0.25"},
            {"ISO003", "K. pneumoniae",   "blood", "Ampicillin",     "R", ">32"},
            {"ISO003", "K. pneumoniae",   "blood", "Ceftriaxone",    "R", ">64"},
            {"ISO003", "K. pneumoniae",   "blood", "Meropenem",      "R", "8"},
            {"ISO003", "K. pneumoniae",   "blood", "Colistin",       "S", "0.5"},
            {"ISO004", "P. aeruginosa",   "sputum","Piperacillin",   "I", "32"},
            {"ISO004", "P. aeruginosa",   "sputum","Meropenem",      "S", "2"},
            {"ISO004", "P. aeruginosa",   "sputum","Ciprofloxacin",  "R", ">4"},
        };

        // TODO Step 1: Build antibiogram (% susceptibility per organism per antibiotic)
        // TODO Step 2: Detect MRSA (Oxacillin-resistant S. aureus)
        // TODO Step 3: Detect ESBL (Extended-Spectrum Beta-Lactamase) producers:
        //   Ceftriaxone-R but Meropenem-S = likely ESBL
        // TODO Step 4: Detect CRE (Carbapenem-Resistant Enterobacteriaceae):
        //   Meropenem-R Klebsiella = CRITICAL alert → infection control
        // TODO Step 5: Flag pan-resistant organisms (resistant to all tested)
        // TODO Step 6: Calculate resistance rates over time (quarterly trends)
        // TODO Step 7: Generate empiric therapy recommendations based on local antibiogram:
        //   "For UTI at this facility: use Ciprofloxacin (85% susceptible) NOT Ampicillin (30%)"
        // TODO Step 8: WHO AWaRe classification of antibiotic use:
        //   Access (1st line), Watch (restricted), Reserve (last resort)
        // TODO Step 9: Generate AMR report for national surveillance (Ghana NCDC)

        System.out.println("Culture results: " + cultureResults.length);
        System.out.println("[TODO: Implement AMR surveillance system]");
    }
}` }]
    },
    { id: 'proj-social-prescribe', name: 'P65: Social Prescribing Engine', icon: 'fa-hand-holding-heart',
      mainClass: 'SocialPrescribing', files: [{ path: 'SocialPrescribing.java', content:
`public class SocialPrescribing {
    public static void main(String[] args) {
        System.out.println("=== Social Prescribing & Community Health Platform ===");
        System.out.println("Beyond Medicine — Addressing Root Causes of Illness\\n");

        String name = "Ama Darko";
        System.out.print("Age: "); int age = 0;  // Test value

        // Social Determinants Assessment
        System.out.println("\\n--- Social Determinants Screening ---");
        System.out.println("Score 0 (no concern) to 3 (severe concern):");
        System.out.print("Food insecurity: "); int food = 0;  // Test value
        System.out.print("Housing instability: "); int housing = 0;  // Test value
        System.out.print("Financial stress: "); int financial = 0;  // Test value
        System.out.print("Social isolation/loneliness: "); int isolation = 0;  // Test value
        System.out.print("Transportation barriers: "); int transport = 0;  // Test value
        System.out.print("Domestic safety concerns: "); int safety = 0;  // Test value
        System.out.print("Literacy/language barriers: "); int literacy = 0;  // Test value
        System.out.print("Unemployment: "); int employment = 0;  // Test value

        // TODO: Calculate total social risk score
        // TODO: Identify top 3 social needs
        // TODO: Match patient to community resources:
        //   Food insecurity → community farm programs, food banks, school feeding
        //   Housing → social welfare, housing NGOs
        //   Isolation → community health worker visits, church groups, support groups
        //   Transport → community health volunteer network, mobile clinic schedule
        //   Employment → skills training programs, micro-finance
        // TODO: Generate "social prescription" alongside medical prescription:
        //   "Rx: Metformin 500mg BD
        //    Social Rx: Community diabetes support group (Tuesdays 4pm, Madina Health Center)
        //    Social Rx: Food voucher program enrollment (high food insecurity)
        //    Social Rx: Monthly home visit by Community Health Worker"
        // TODO: Track social intervention outcomes:
        //   Did food security improve? Did HbA1c improve after food intervention?
        // TODO: Calculate correlation between social determinant scores and health outcomes
        // TODO: Generate evidence report: "Patients receiving social prescriptions had 23%
        //   fewer ED visits and 15% better medication adherence"

        System.out.println("\\n[TODO: Implement social prescribing engine]");
        // Done
    }
}` }]
    },
    { id: 'proj-climate-health', name: 'P66: Climate-Health Predictor', icon: 'fa-cloud-sun',
      mainClass: 'ClimateHealth', files: [{ path: 'ClimateHealth.java', content:
`public class ClimateHealth {
    public static void main(String[] args) {
        System.out.println("=== Climate-Sensitive Disease Prediction Engine ===");
        System.out.println("Weather Data → Disease Burden Forecasting\\n");

        // Monthly weather data for Accra (12 months)
        // {month, avgTemp_C, rainfall_mm, humidity%, floodEvents}
        double[][] weatherData = {
            {1, 27.5, 15, 75, 0},    // January (dry)
            {2, 28.2, 25, 72, 0},
            {3, 28.8, 58, 78, 0},
            {4, 28.5, 82, 80, 1},    // Rainy season starts
            {5, 27.8, 145, 83, 2},
            {6, 26.2, 215, 86, 3},   // Peak rain
            {7, 25.5, 58, 84, 1},    // Short dry spell
            {8, 25.2, 22, 82, 0},
            {9, 26.0, 68, 83, 1},
            {10, 27.2, 82, 81, 1},   // Minor rainy season
            {11, 28.0, 38, 78, 0},
            {12, 27.8, 18, 76, 0},
        };

        // Historical disease case counts by month
        // {month, malariaCases, choleraCases, dengue, meningitis, diarrheaUnder5}
        int[][] diseaseCounts = {
            {1, 320, 5, 2, 45, 180},
            {2, 280, 3, 5, 52, 150},
            {3, 450, 8, 8, 38, 220},
            {4, 620, 15, 12, 20, 350},
            {5, 890, 35, 18, 8, 480},
            {6, 1100, 65, 22, 3, 620},  // Peak malaria + cholera
            {7, 750, 25, 15, 5, 380},
            {8, 500, 10, 8, 8, 250},
            {9, 680, 22, 14, 6, 340},
            {10, 780, 28, 16, 5, 400},
            {11, 420, 8, 6, 25, 200},
            {12, 350, 4, 3, 40, 170},   // Meningitis peaks in dry harmattan
        };

        // TODO Step 1: Calculate correlation coefficients:
        //   rainfall vs malaria (expect +0.8 to +0.9, 6-8 week lag)
        //   rainfall vs cholera (expect +0.7, 2-4 week lag after flooding)
        //   temperature vs meningitis (expect inverse — dry dusty harmattan)
        // TODO Step 2: Build linear regression models with lag:
        //   malaria_next_month = a + b1*rainfall_2months_ago + b2*temperature
        // TODO Step 3: Forecast next month's disease burden based on current weather
        // TODO Step 4: Identify outbreak thresholds per disease per season
        // TODO Step 5: Resource pre-positioning recommendations:
        //   "June forecast: 1100 malaria cases expected.
        //    Ensure: 1500 ACT courses, 200 RDT kits, 50 severe malaria kits"
        // TODO Step 6: Climate change scenario modeling:
        //   If avg temperature increases 1.5°C → projected malaria case change?
        //   If rainfall increases 20% → projected cholera risk change?
        // TODO Step 7: Generate monthly climate-health bulletin for District Health Directorate

        System.out.println("Weather data: " + weatherData.length + " months");
        System.out.println("[TODO: Implement climate-health prediction]");
    }
}` }]
    },
    { id: 'proj-supply-chain', name: 'P67: Medical Supply Chain AI', icon: 'fa-truck-medical',
      mainClass: 'SupplyChainAI', files: [{ path: 'SupplyChainAI.java', content:
`public class SupplyChainAI {
    public static void main(String[] args) {
        System.out.println("=== AI-Driven Medical Supply Chain Optimizer ===");
        System.out.println("Preventing Stockouts & Reducing Waste\\n");

        // Current inventory at district medical store
        // {itemCode, itemName, category, currentStock, monthlyUsage, unitCost_GHS,
        //  leadTimeDays, expiryMonths, minStockMonths}
        String[][] inventory = {
            {"ACT-01", "Artemether-Lumefantrine", "ANTIMALARIAL", "2500", "800", "3.50", "30", "18", "3"},
            {"AMX-01", "Amoxicillin 500mg",       "ANTIBIOTIC",   "1800", "600", "0.80", "21", "24", "3"},
            {"ORS-01", "ORS sachets",              "ESSENTIAL",    "500",  "400", "0.30", "14", "36", "3"},
            {"INS-01", "Insulin Glargine 10mL",    "DIABETES",     "45",   "30",  "85.00","45", "6",  "2"},
            {"OXY-01", "Oxytocin 10IU ampoule",    "MATERNAL",     "120",  "50",  "2.50", "21", "12", "3"},
            {"RDT-01", "Malaria RDT kits",         "DIAGNOSTIC",   "3000", "1200","1.20", "30", "12", "2"},
            {"GLV-01", "Exam gloves (box 100)",     "SUPPLIES",     "80",   "60",  "35.00","14", "48", "2"},
            {"MRP-01", "Meropenem 1g vial",        "ANTIBIOTIC",   "25",   "8",   "45.00","60", "18", "3"},
        };

        // TODO Step 1: Calculate months of stock remaining = currentStock / monthlyUsage
        // TODO Step 2: Flag items below minimum stock level (RED alert)
        // TODO Step 3: Flag items approaching expiry (within 3 months)
        // TODO Step 4: Calculate reorder point = (monthlyUsage/30) * leadTimeDays + safetyStock
        //   Safety stock = 1.65 * sigma_demand * sqrt(leadTimeDays/30)
        // TODO Step 5: Calculate Economic Order Quantity (EOQ):
        //   EOQ = sqrt(2 * annual_demand * order_cost / holding_cost)
        // TODO Step 6: Seasonal demand adjustment:
        //   Antimalarials: +50% in June-July (rainy season)
        //   ORS: +40% in rainy season (diarrhea spike)
        // TODO Step 7: Predict stockout dates for each item
        // TODO Step 8: Generate automated purchase orders
        // TODO Step 9: Calculate waste from expiry (items that expired before use)
        // TODO Step 10: Optimization: redistribute excess stock between facilities
        //   "Facility A has 6 months of ACT, Facility B has 1 month → transfer 1000 units"

        System.out.println("Items tracked: " + inventory.length);
        System.out.println("[TODO: Implement supply chain optimizer]");
    }
}` }]
    },
    { id: 'proj-telederm', name: 'P68: Teledermatology Classifier', icon: 'fa-image',
      mainClass: 'TeleDerm', files: [{ path: 'TeleDerm.java', content:
`public class TeleDerm {
    public static void main(String[] args) {
        System.out.println("=== Teledermatology Image Classifier ===");
        System.out.println("Rule-Based Skin Lesion Analysis (No ML Required)\\n");

        // Skin lesion feature extraction (from clinical photo description)
        // In a real system, these would come from image processing
        // {lesionID, shape, border, color, diameter_mm, symmetry, elevation, distribution}
        String[][] lesions = {
            {"L001", "round", "well-defined", "brown_uniform", "4", "symmetric", "flat", "single"},
            {"L002", "irregular", "ragged", "brown_black_mixed", "8", "asymmetric", "raised", "single"},
            {"L003", "oval", "well-defined", "pink", "15", "symmetric", "raised", "multiple"},
            {"L004", "round", "well-defined", "skin_colored", "3", "symmetric", "dome_shaped", "multiple"},
            {"L005", "irregular", "poorly-defined", "red_crusted", "12", "asymmetric", "ulcerated", "single"},
        };

        // TODO Step 1: Apply ABCDE criteria (melanoma screening):
        //   A = Asymmetry (asymmetric = +1 point)
        //   B = Border irregularity (ragged/poorly-defined = +1)
        //   C = Color variation (multiple colors = +1)
        //   D = Diameter > 6mm (+1)
        //   E = Elevation/Evolution (raised/ulcerated = +1)
        //   Score >= 3 → REFER to dermatologist (possible melanoma)
        // TODO Step 2: Rule-based differential diagnosis:
        //   Well-defined + brown + uniform + < 6mm = likely benign nevus
        //   Dome-shaped + skin-colored + multiple = likely dermatofibroma or warts
        //   Red + crusted + ulcerated = possible BCC or SCC → URGENT referral
        //   Multiple + pink + raised = possible psoriasis or fungal
        // TODO Step 3: Generate urgency classification:
        //   ROUTINE: clearly benign → manage at health center
        //   SOON: uncertain → dermatology appointment within 2 weeks
        //   URGENT: suspicious for malignancy → referral within 48 hours
        // TODO Step 4: Generate teledermatology referral with structured data
        // TODO Step 5: Africa-specific: consider tropical conditions:
        //   Keloids (more common in African skin)
        //   Tinea (fungal) infections
        //   Kaposi sarcoma (HIV-associated)
        //   Leishmaniasis (tropical ulcer DDx)

        System.out.println("Lesions to analyze: " + lesions.length);
        System.out.println("[TODO: Implement skin lesion classifier]");
    }
}` }]
    },
    { id: 'proj-voice-ehr', name: 'P69: Voice-to-EHR Converter', icon: 'fa-microphone',
      mainClass: 'VoiceToEHR', files: [{ path: 'VoiceToEHR.java', content:
`public class VoiceToEHR {
    public static void main(String[] args) {
        System.out.println("=== Voice-to-EHR Structured Data Converter ===");
        System.out.println("Doctor's Voice Note → FHIR Resources\\n");

        // Simulated voice transcript (what the doctor dictated)
        String voiceTranscript =
            "Patient is Kwame Asante, 58 year old male, seen today March 15th for follow up of "
            + "his diabetes and hypertension. He reports good compliance with medications. "
            + "Current meds are Metformin one thousand milligrams twice daily, Amlodipine five "
            + "milligrams once daily, and Atorvastatin twenty milligrams at night. "
            + "Vitals today: blood pressure one forty two over ninety, pulse seventy-eight, "
            + "temperature thirty-six point five, weight eighty-two kilograms. "
            + "Lab results from last week: fasting blood sugar one sixty-five, "
            + "HbA1c seven point eight percent, creatinine one point two, "
            + "total cholesterol two twenty, LDL one forty-five. "
            + "Assessment: Type 2 diabetes suboptimally controlled, "
            + "stage 1 hypertension not at target, dyslipidemia improving. "
            + "Plan: increase Metformin to one thousand five hundred milligrams twice daily, "
            + "add Losartan fifty milligrams daily for renal protection, "
            + "continue Atorvastatin, diet and exercise counseling given, "
            + "follow up in three months with repeat labs.";

        System.out.println("Voice Transcript:");
        System.out.println(voiceTranscript);
        System.out.println("\\n" + "=".repeat(50));

        // TODO Step 1: Extract patient name using NER pattern (capitalized words after "Patient is")
        // TODO Step 2: Parse vital signs from spoken numbers:
        //   "one forty two over ninety" → 142/90 mmHg
        //   "seventy-eight" → 78 bpm
        //   "thirty-six point five" → 36.5 °C
        //   Handle: "one thousand" → 1000, "twenty" → 20
        // TODO Step 3: Parse medication names + doses from natural speech
        // TODO Step 4: Parse lab results (spoken numbers → structured values)
        // TODO Step 5: Extract diagnoses and map to ICD-10 codes
        // TODO Step 6: Extract plan items as structured orders
        // TODO Step 7: Build FHIR resources from extracted data:
        //   Encounter, Observation (vitals), Observation (labs),
        //   MedicationRequest (new/changed), Condition (diagnoses)
        // TODO Step 8: Handle ambiguity: "one forty-five" → 145 (lab) or 1.45 (creatinine)?
        //   Context-aware parsing using expected ranges per test
        // TODO Step 9: Confidence scoring: flag low-confidence extractions for human review

        System.out.println("\\n[TODO: Implement voice-to-EHR converter]");
    }
}` }]
    },
    { id: 'proj-community-hw', name: 'P70: Community Health Worker App', icon: 'fa-people-roof',
      mainClass: 'CHWApp', files: [{ path: 'CHWApp.java', content:
`public class CHWApp {
    public static void main(String[] args) {
        System.out.println("=== Community Health Worker Digital Toolkit ===");
        System.out.println("CHPS Compound — Household Visit Management\\n");

        System.out.println("CHW Name: Abena Mensah");
        System.out.println("CHPS Zone: Abokobi Zone 3");
        System.out.println("Households assigned: 150");
        System.out.println("\\n--- Today's Visit Schedule ---");

        // Households to visit today
        String[][] schedule = {
            {"HH-045", "Darko Family", "Pregnant woman (32 wks) — ANC follow-up", "HIGH"},
            {"HH-078", "Mensah Family", "Child (11 mo) — Immunization due (Measles-1)", "HIGH"},
            {"HH-092", "Asante Family", "Elderly diabetic — medication refill check", "MEDIUM"},
            {"HH-103", "Boateng Family", "Newborn (2 wks) — postnatal visit", "HIGH"},
            {"HH-121", "Owusu Family", "General household — health education", "LOW"},
        };

        // TODO Step 1: Display prioritized visit list (HIGH → MEDIUM → LOW)
        // TODO Step 2: For PREGNANT WOMAN visit, implement:
        //   - Measure BP, weight, fundal height
        //   - Check danger signs checklist (headache, swelling, bleeding, reduced fetal movement)
        //   - Verify iron/folate supplementation compliance
        //   - Birth preparedness plan check (facility chosen, transport arranged, savings)
        //   - If ANY danger sign → immediate referral to health center
        // TODO Step 3: For IMMUNIZATION visit:
        //   - Check immunization card against EPI schedule
        //   - Record vaccines given with batch numbers
        //   - Schedule next appointment
        //   - Track defaulters (missed appointments)
        // TODO Step 4: For DIABETES visit:
        //   - Blood glucose check (if glucometer available)
        //   - Medication adherence assessment
        //   - Foot examination reminder
        //   - Diet and exercise counseling checklist
        // TODO Step 5: For NEWBORN visit:
        //   - Weight check, feeding assessment (exclusive breastfeeding?)
        //   - Danger signs (fever, not feeding, jaundice, cord infection)
        //   - Maternal wellbeing check (postpartum depression screening)
        // TODO Step 6: GPS-stamp each visit with timestamp
        // TODO Step 7: Generate daily visit report for CHPS compound
        // TODO Step 8: Calculate coverage metrics:
        //   - % pregnant women visited this month
        //   - % children fully immunized
        //   - % diabetics with controlled glucose
        // TODO Step 9: Sync data with DHIS2 at end of day

        System.out.println("\\nVisits scheduled today: " + schedule.length);
        System.out.println("[TODO: Implement CHW visit management]");
        // Done
    }
}` }]
    },
    { id: 'proj-rare-disease', name: 'P71: Rare Disease Matcher', icon: 'fa-magnifying-glass-plus',
      mainClass: 'RareDiseaseMatcher', files: [{ path: 'RareDiseaseMatcher.java', content:
`public class RareDiseaseMatcher {
    public static void main(String[] args) {
        System.out.println("=== Rare Disease Phenotype-Genotype Matcher ===");
        System.out.println("HPO-Based Differential Diagnosis for Undiagnosed Patients\\n");

        // Patient's phenotype features (using Human Phenotype Ontology terms)
        String[] patientPhenotypes = {
            "HP:0001250",  // Seizures
            "HP:0001263",  // Global developmental delay
            "HP:0000252",  // Microcephaly
            "HP:0001344",  // Absent speech
            "HP:0100022",  // Abnormality of movement (ataxia)
            "HP:0000717",  // Autism
            "HP:0100710",  // Happy demeanor (frequent smiling/laughing)
        };

        // Rare disease database (simplified)
        // {diseaseID, diseaseName, associatedHPO_terms, gene, inheritance}
        String[][] diseaseDB = {
            {"OMIM:105830", "Angelman Syndrome", "HP:0001250,HP:0001263,HP:0000252,HP:0001344,HP:0100022,HP:0100710", "UBE3A", "imprinting_15q11"},
            {"OMIM:312750", "Rett Syndrome", "HP:0001250,HP:0001263,HP:0000252,HP:0001344,HP:0100022", "MECP2", "X-linked"},
            {"OMIM:607411", "Phelan-McDermid", "HP:0001250,HP:0001263,HP:0001344,HP:0000717", "SHANK3", "AD_deletion_22q13"},
            {"OMIM:300624", "CDKL5 Deficiency", "HP:0001250,HP:0001263,HP:0000252,HP:0100022", "CDKL5", "X-linked"},
            {"OMIM:613454", "Kleefstra Syndrome", "HP:0001263,HP:0000252,HP:0001344,HP:0000717", "EHMT1", "AD_9q34"},
        };

        // TODO Step 1: Parse HPO terms for patient and each disease
        // TODO Step 2: Calculate phenotype overlap score:
        //   Jaccard similarity = intersection / union of HPO terms
        // TODO Step 3: Rank diseases by similarity score (highest first)
        // TODO Step 4: For top match, calculate:
        //   - Matching features (present in both)
        //   - Missing features (in disease but not patient)
        //   - Extra features (in patient but not disease)
        // TODO Step 5: Suggest confirmatory genetic testing:
        //   "Top match: Angelman Syndrome (85% phenotype overlap)
        //    Confirm with: DNA methylation analysis of 15q11-q13 region
        //    Gene: UBE3A — test for deletion, UPD, imprinting defect, or point mutation"
        // TODO Step 6: Generate differential diagnosis report with probability ranking
        // TODO Step 7: Flag if no disease matches > 50% → possible novel/uncharacterized syndrome
        // TODO Step 8: Suggest specialist referral pathway (genetics clinic)

        System.out.println("Patient phenotypes: " + patientPhenotypes.length);
        System.out.println("Disease database: " + diseaseDB.length + " conditions");
        System.out.println("[TODO: Implement rare disease matching]");
    }
}` }]
    },
    { id: 'proj-med-device-sim', name: 'P72: Medical Device Simulator', icon: 'fa-microchip',
      mainClass: 'DeviceSimulator', files: [{ path: 'DeviceSimulator.java', content:
`public class DeviceSimulator {
    public static void main(String[] args) {
        System.out.println("=== Medical Device Data Simulator ===");
        System.out.println("Virtual Pulse Oximeter + ECG Monitor + Infusion Pump\\n");

        // TODO Step 1: Simulate Pulse Oximeter data stream:
        //   Generate SpO2 (90-100%), pulse rate (50-120 bpm), pleth waveform
        //   Simulate artifacts: motion, low perfusion, ambient light
        //   Alarm: SpO2 < 90%, HR < 50 or > 120
        // TODO Step 2: Simulate ECG Monitor:
        //   Generate PQRST waveform points at 250Hz sampling
        //   Normal sinus rhythm → manipulate to simulate:
        //     Sinus tachycardia (HR > 100)
        //     Atrial fibrillation (irregular R-R, absent P waves)
        //     ST elevation (acute MI pattern)
        //     Ventricular tachycardia (wide QRS, regular)
        //     Asystole (flat line)
        //   Generate appropriate alarms for each rhythm
        // TODO Step 3: Simulate IV Infusion Pump:
        //   Drug: Dopamine 400mg in 250mL D5W
        //   Calculate: concentration (mcg/mL), dose rate (mcg/kg/min → mL/hr)
        //   Simulate flow: volume infused, volume remaining, time remaining
        //   Alarms: occlusion, air-in-line, low volume, dose limit exceeded
        // TODO Step 4: Output as HL7 messages (OBX segments)
        // TODO Step 5: Simulate device communication via serial port protocol:
        //   Build message frames: [STX][data][checksum][ETX]
        //   Validate checksums on received data
        // TODO Step 6: Build alarm escalation logic:
        //   Level 1 (advisory): flashing yellow, soft beep
        //   Level 2 (warning): flashing yellow, medium beep
        //   Level 3 (critical): flashing red, continuous alarm, nurse notification

        System.out.println("[TODO: Implement medical device simulator]");
    }
}` }]
    },
    { id: 'proj-pandemic-model', name: 'P73: Pandemic Spread Modeler', icon: 'fa-globe-africa',
      mainClass: 'PandemicModel', files: [{ path: 'PandemicModel.java', content:
`public class PandemicModel {
    public static void main(String[] args) {
        System.out.println("=== SIR Pandemic Spread Model ===");
        System.out.println("Compartmental Epidemiological Simulation\\n");

        // Ghana population parameters
        double population = 33000000;
        double initialInfected = 10;
        double initialRecovered = 0;
        double susceptible = population - initialInfected;

        // Disease parameters (COVID-like)
        double R0 = 2.5;             // Basic reproduction number
        double infectiousPeriod = 10; // days
        double gamma = 1.0 / infectiousPeriod;  // recovery rate
        double beta = R0 * gamma / population;   // transmission rate
        double vaccinationRate = 0.005; // 0.5% of susceptible vaccinated per day

        int simulationDays = 365;

        // TODO Step 1: Implement basic SIR model (Euler method):
        //   dS/dt = -beta * S * I
        //   dI/dt = beta * S * I - gamma * I
        //   dR/dt = gamma * I
        // TODO Step 2: Extend to SEIR (add Exposed compartment):
        //   Incubation period = 5 days, sigma = 1/5
        //   dE/dt = beta * S * I - sigma * E
        // TODO Step 3: Add vaccination: move susceptible → recovered at vaccination rate
        // TODO Step 4: Add non-pharmaceutical interventions:
        //   Lockdown: reduce beta by 60% from day 30-60
        //   Masks: reduce beta by 30% from day 15 onwards
        //   Social distancing: reduce beta by 40%
        // TODO Step 5: Find epidemic peak (day with maximum infections)
        // TODO Step 6: Calculate herd immunity threshold = 1 - 1/R0
        // TODO Step 7: Compare scenarios:
        //   No intervention, lockdown only, vaccination only, combined
        // TODO Step 8: Calculate total deaths (assume 1% infection fatality rate)
        // TODO Step 9: Generate ASCII epidemic curve chart
        // TODO Step 10: Ghana-specific: model regional spread between districts
        //   using population movement data

        System.out.println("Population: " + (int)population);
        System.out.println("R0: " + R0);
        System.out.println("Simulation: " + simulationDays + " days");
        System.out.println("[TODO: Implement SIR/SEIR pandemic model]");
    }
}` }]
    },
    { id: 'proj-smart-triage', name: 'P74: Smart Triage (Pediatric)', icon: 'fa-children',
      mainClass: 'SmartTriage', files: [{ path: 'SmartTriage.java', content:
`public class SmartTriage {
    public static void main(String[] args) {
        System.out.println("=== Smart Triage — AI Pediatric Emergency Triage ===");
        System.out.println("Predicting Mortality Risk from Arrival Vital Signs\\n");

        // This is based on real research from Uganda/Canada collaboration
        // Using 3 vital signs at arrival to predict 24h mortality risk

        System.out.print("Child name: "); String name = 0;  // Test value
        System.out.print("Age (months): "); int ageMonths = 0;  // Test value
        System.out.print("Heart rate (bpm): "); int hr = 0;  // Test value
        System.out.print("Respiratory rate (breaths/min): "); int rr = 0;  // Test value
        System.out.print("SpO2 (%): "); int spo2 = 0;  // Test value
        System.out.print("Temperature (°C): "); double temp = 0.0;  // Test value
        System.out.print("MUAC (cm, 0 if not measured): "); double muac = 0.0;  // Test value
        System.out.print("Capillary refill time (seconds): "); int crt = 0;  // Test value
        System.out.print("AVPU consciousness (A=0, V=1, P=2, U=3): "); int avpu = 0;  // Test value

        // TODO Step 1: Age-adjusted vital sign interpretation:
        //   Tachycardia thresholds: <1yr >160, 1-5yr >140, >5yr >120
        //   Tachypnea thresholds: <1yr >50, 1-5yr >40, >5yr >30
        // TODO Step 2: Calculate Pediatric Early Warning Score (PEWS):
        //   HR, RR, SpO2, consciousness, capillary refill → 0-3 per parameter
        // TODO Step 3: Build logistic regression risk model:
        //   Risk = 1/(1+exp(-(b0 + b1*hr_zscore + b2*rr_zscore + b3*(100-spo2) + b4*avpu)))
        //   Coefficients from published Smart Triage research
        // TODO Step 4: Traffic light classification:
        //   GREEN (risk < 5%): routine OPD queue
        //   YELLOW (risk 5-15%): priority assessment within 30 min
        //   RED (risk > 15%): immediate emergency assessment
        // TODO Step 5: Additional danger signs check:
        //   MUAC < 11.5 + sick child = critical malnutrition
        //   CRT > 3 seconds = shock → immediate IV access
        //   AVPU = P or U = altered consciousness → protect airway
        // TODO Step 6: Generate triage ticket with color code, risk score, priority actions
        // TODO Step 7: This system was designed for LOW-RESOURCE settings:
        //   Works with just pulse oximeter + thermometer
        //   No blood tests needed at triage point
        //   Reduces under-triage mortality by >50% in published studies

        System.out.println("\\n[TODO: Implement Smart Triage algorithm]");
        // Done
    }
}` }]
    },
    { id: 'proj-health-atlas', name: 'P75: Ghana Health Facility Atlas', icon: 'fa-map-location-dot',
      mainClass: 'HealthAtlas', files: [{ path: 'HealthAtlas.java', content:
`public class HealthAtlas {
    public static void main(String[] args) {
        System.out.println("=== Ghana Health Facility Atlas & Access Analyzer ===");
        System.out.println("Mapping Healthcare Access Across All 16 Regions\\n");

        // Health facilities with geolocation
        // {facilityID, name, type, region, district, lat, lon, beds, hasOR, hasLab, hasBloodBank, has24hrService}
        String[][] facilities = {
            {"GHS-0001", "Korle Bu Teaching Hospital", "TEACHING", "Greater Accra", "Accra Metro", "5.5364", "-0.2279", "2000", "1", "1", "1", "1"},
            {"GHS-0002", "37 Military Hospital", "TERTIARY", "Greater Accra", "Accra Metro", "5.5770", "-0.2100", "600", "1", "1", "1", "1"},
            {"GHS-0010", "Ridge Hospital", "REGIONAL", "Greater Accra", "Accra Metro", "5.5580", "-0.2020", "420", "1", "1", "1", "1"},
            {"GHS-0100", "Tamale Teaching Hospital", "TEACHING", "Northern", "Tamale Metro", "9.4034", "-0.8424", "800", "1", "1", "1", "1"},
            {"GHS-0200", "Bolgatanga Regional Hospital", "REGIONAL", "Upper East", "Bolgatanga", "10.7870", "-0.8512", "200", "1", "1", "0", "1"},
            {"GHS-0312", "Ga East District Hospital", "DISTRICT", "Greater Accra", "Ga East", "5.6721", "-0.1798", "80", "1", "1", "0", "1"},
            {"GHS-0500", "Nkwanta District Hospital", "DISTRICT", "Oti", "Nkwanta South", "8.2600", "0.5100", "60", "1", "1", "0", "0"},
            {"GHS-0600", "Abokobi Health Center", "HC", "Greater Accra", "Ga East", "5.7169", "-0.1623", "0", "0", "0", "0", "0"},
            {"GHS-0700", "Bawku Presbyterian Hospital", "DISTRICT", "Upper East", "Bawku Municipal", "11.0590", "-0.2420", "100", "1", "1", "0", "1"},
            {"GHS-0800", "Keta Municipal Hospital", "DISTRICT", "Volta", "Keta Municipal", "5.9180", "0.9900", "50", "0", "1", "0", "1"},
        };

        // Population centers needing access
        // {communityName, region, population, lat, lon}
        String[][] communities = {
            {"Abokobi", "Greater Accra", "25000", "5.7169", "-0.1623"},
            {"Nsawam", "Eastern", "35000", "5.8000", "-0.3500"},
            {"Yendi", "Northern", "50000", "9.4330", "-0.0100"},
            {"Bole", "Savannah", "20000", "9.0330", "-2.4830"},
            {"Dambai", "Oti", "15000", "8.0670", "0.1830"},
        };

        // TODO Step 1: Calculate distance between each community and nearest facility:
        //   Haversine formula: d = 2R * arcsin(sqrt(sin²(Δlat/2) + cos(lat1)*cos(lat2)*sin²(Δlon/2)))
        // TODO Step 2: Find nearest facility of each type (HC, District, Regional, Teaching)
        // TODO Step 3: Calculate travel time estimate:
        //   Paved road: 50 km/hr, Unpaved: 30 km/hr, Footpath: 5 km/hr
        // TODO Step 4: Identify underserved communities:
        //   > 10 km from ANY facility = underserved
        //   > 50 km from surgical facility = surgical desert
        //   > 100 km from blood bank = transfusion access gap
        // TODO Step 5: Calculate population-to-facility ratios per district
        // TODO Step 6: Identify optimal locations for new facilities:
        //   Where would a new health center maximize population coverage?
        //   Weighted centroid of underserved communities
        // TODO Step 7: Generate access equity report per region
        // TODO Step 8: Emergency referral routing:
        //   Given a patient location + required service → nearest capable facility + route
        // TODO Step 9: Compare Ghana health facility density to WHO benchmarks

        System.out.println("Facilities: " + facilities.length);
        System.out.println("Communities: " + communities.length);
        System.out.println("[TODO: Implement health access analyzer]");
    }
}` }]
    },
  ];

  let currentProject = null;

  function renderProjectList(container) {
    container.innerHTML = '';
    PROJECTS.forEach(proj => {
      const el = document.createElement('div');
      el.className = 'mj-project-item';
      el.dataset.projectId = proj.id;
      el.innerHTML = `<i class="fas ${proj.icon}"></i> ${proj.name}`;
      el.addEventListener('click', () => loadProject(proj.id));
      container.appendChild(el);
    });
  }

  function loadProject(projectId) {
    const proj = PROJECTS.find(p => p.id === projectId);
    if (!proj) return;

    currentProject = proj;

    // Update UI
    document.querySelectorAll('.mj-project-item').forEach(el => {
      el.classList.toggle('active', el.dataset.projectId === projectId);
    });

    // Load code into editor
    const editor = document.getElementById('codeEditor');
    if (editor && proj.files.length > 0) {
      editor.value = proj.files[0].content;
    }

    // Update tabs
    const tabs = document.getElementById('editorTabs');
    if (tabs) {
      tabs.innerHTML = proj.files.map((f, i) =>
        `<button class="mj-tab${i === 0 ? ' active' : ''}">${f.path}</button>`
      ).join('');
    }

    // Clear console
    const console = document.getElementById('consoleOutput');
    if (console) {
      console.innerHTML = `<span class="text-muted">Project loaded: ${proj.name}\nPress Run to compile and execute.</span>`;
    }
  }

  async function runCode() {
    const editor = document.getElementById('codeEditor');
    const consoleEl = document.getElementById('consoleOutput');
    if (!editor || !consoleEl) return;

    const code = editor.value;
    const mainClass = currentProject?.mainClass || 'Main';

    consoleEl.innerHTML = '<span class="meta">Compiling and running...</span>\n';

    const backendUrl = window.BACKEND_URL;
    if (!backendUrl) {
      // Simulate execution locally for demo
      consoleEl.innerHTML += '<span class="stderr">Backend not connected. Configure BACKEND_URL to enable real Java execution.</span>\n';
      consoleEl.innerHTML += '<span class="meta">--- Simulated Output ---</span>\n';

      // Simple simulation: extract println strings
      const printRegex = /System\.out\.println\("([^"]*?)"\)/g;
      let match;
      while ((match = printRegex.exec(code)) !== null) {
        let output = match[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        consoleEl.innerHTML += `<span class="stdout">${escapeHtml(output)}</span>\n`;
      }
      consoleEl.innerHTML += '<span class="meta">\n[Simulated] Exit 0</span>';
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/sandbox/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: [{ path: `${mainClass}.java`, content: code }],
          mainClass
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const evt of events) {
          if (!evt.startsWith('data: ')) continue;
          const msg = JSON.parse(evt.slice(6));

          if (msg.type === 'stdout') {
            consoleEl.innerHTML += `<span class="stdout">${escapeHtml(msg.data)}</span>`;
          } else if (msg.type === 'stderr') {
            consoleEl.innerHTML += `<span class="stderr">${escapeHtml(msg.data)}</span>`;
          } else if (msg.type === 'complete') {
            const r = msg.result;
            consoleEl.innerHTML += `\n<span class="meta">[Exit ${r.exitCode}] ${r.durationMs}ms${r.killed ? ' (killed - timeout)' : ''}</span>`;
          } else if (msg.type === 'error') {
            consoleEl.innerHTML += `<span class="stderr">Error: ${escapeHtml(msg.message)}</span>`;
          }
        }
      }
    } catch (err) {
      consoleEl.innerHTML += `<span class="stderr">Connection error: ${escapeHtml(err.message)}</span>`;
    }
  }

  function resetCode() {
    if (currentProject) {
      loadProject(currentProject.id);
    }
  }

  function loadCodeIntoSandbox(code) {
    const editor = document.getElementById('codeEditor');
    if (editor) {
      editor.value = code;
      // Extract class name and set it
      const classMatch = code.match(/public\s+class\s+(\w+)/);
      const className = classMatch ? classMatch[1] : 'MedJavaSnippet';
      
      // Update the tab name
      const tab = document.querySelector('.mj-tab.active');
      if (tab) tab.textContent = className + '.java';
      
      // Set as current project for running
      currentProject = {
        mainClass: className,
        files: [{ path: className + '.java', content: code }]
      };
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  return { renderProjectList, loadProject, runCode, resetCode, loadCodeIntoSandbox, PROJECTS };
})();
