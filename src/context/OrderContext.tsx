import { createContext, useContext, useState, ReactNode } from "react";

export type OilType = "standard" | "premium" | "bio";
export type AdditiveType = "none" | "flow" | "tank" | "combo";
export type TimeSlot = "morning" | "afternoon" | "flexible";
export type HoseLength = "standard" | "extended";
export type Salutation = "herr" | "frau" | "divers";

export interface Provider {
  id: string;
  name: string;
  fullName: string;
  priceMultiplier: number;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  certifications: string[];
}

export interface OrderState {
  // Step 1 - Product
  postalCode: string;
  city: string;
  oilType: OilType;
  quantity: number;
  additive: AdditiveType;
  
  // Step 2 - Provider
  provider: Provider | null;
  pricePerLiter: number;
  totalPrice: number;
  
  // Step 3 - Date
  deliveryDate: Date | null;
  timeSlot: TimeSlot;
  
  // Step 4 - Delivery
  street: string;
  houseNumber: string;
  truckAccessible: boolean;
  hoseLength: HoseLength;
  deliveryNotes: string;
  
  // Step 5 - Personal Data
  salutation: Salutation;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  billingAddressSame: boolean;
  billingStreet: string;
  billingHouseNumber: string;
  billingPostalCode: string;
  billingCity: string;
  remarks: string;
  
  // Step 6 - Terms
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}

interface OrderContextType {
  order: OrderState;
  updateOrder: (updates: Partial<OrderState>) => void;
  resetOrder: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  canProceed: (step: number) => boolean;
}

const initialState: OrderState = {
  postalCode: "",
  city: "",
  oilType: "standard",
  quantity: 2000,
  additive: "none",
  provider: null,
  pricePerLiter: 0,
  totalPrice: 0,
  deliveryDate: null,
  timeSlot: "flexible",
  street: "",
  houseNumber: "",
  truckAccessible: true,
  hoseLength: "standard",
  deliveryNotes: "",
  salutation: "herr",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  billingAddressSame: true,
  billingStreet: "",
  billingHouseNumber: "",
  billingPostalCode: "",
  billingCity: "",
  remarks: "",
  acceptedTerms: false,
  acceptedPrivacy: false,
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<OrderState>(initialState);
  const [currentStep, setCurrentStep] = useState(1);

  const updateOrder = (updates: Partial<OrderState>) => {
    setOrder((prev) => ({ ...prev, ...updates }));
  };

  const resetOrder = () => {
    setOrder(initialState);
    setCurrentStep(1);
  };

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1:
        return order.postalCode.length === 5 && order.quantity >= 500;
      case 2:
        return order.provider !== null;
      case 3:
        return order.deliveryDate !== null;
      case 4:
        return order.street.length > 0 && order.houseNumber.length > 0;
      case 5:
        return (
          order.firstName.length > 0 &&
          order.lastName.length > 0 &&
          order.email.includes("@") &&
          order.phone.length >= 6
        );
      case 6:
        return order.acceptedTerms && order.acceptedPrivacy;
      default:
        return false;
    }
  };

  return (
    <OrderContext.Provider
      value={{ order, updateOrder, resetOrder, currentStep, setCurrentStep, canProceed }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}

// Constants
export const MARKET_PRICE = 0.89; // € per liter - would come from database

export const PROVIDERS: Provider[] = [
  {
    id: "hoyer",
    name: "Hoyer",
    fullName: "Wilhelm Hoyer B.V. & Co. KG",
    priceMultiplier: 1.0,
    rating: 4.8,
    reviewCount: 3420,
    deliveryTime: "2-5 Werktage",
    certifications: ["RAL-Gütezeichen", "Klimaneutral-Option"],
  },
  {
    id: "team-energie",
    name: "team energie",
    fullName: "team energie GmbH & Co. KG",
    priceMultiplier: 1.02,
    rating: 4.7,
    reviewCount: 2890,
    deliveryTime: "2-5 Werktage",
    certifications: ["RAL-Gütezeichen"],
  },
  {
    id: "mobene",
    name: "mobene",
    fullName: "mobene GmbH & Co. KG",
    priceMultiplier: 1.04,
    rating: 4.6,
    reviewCount: 1950,
    deliveryTime: "3-5 Werktage",
    certifications: ["RAL-Gütezeichen", "TÜV-geprüft"],
  },
  {
    id: "nordoel",
    name: "NORDOEL",
    fullName: "Clement Heins GmbH & Co. KG",
    priceMultiplier: 1.05,
    rating: 4.5,
    reviewCount: 1680,
    deliveryTime: "3-5 Werktage",
    certifications: ["RAL-Gütezeichen"],
  },
  {
    id: "baywa",
    name: "BayWa Energie",
    fullName: "BayWa AG – Energie",
    priceMultiplier: 1.07,
    rating: 4.6,
    reviewCount: 2340,
    deliveryTime: "2-4 Werktage",
    certifications: ["RAL-Gütezeichen", "Klimaneutral-Option"],
  },
  {
    id: "esso",
    name: "Esso Heizöl",
    fullName: "ExxonMobil Central Europe Holding GmbH",
    priceMultiplier: 1.09,
    rating: 4.4,
    reviewCount: 1120,
    deliveryTime: "3-5 Werktage",
    certifications: ["Premium-Partner"],
  },
];

export function calculatePrice(
  quantity: number,
  oilType: OilType,
  providerMultiplier: number
): { pricePerLiter: number; totalPrice: number } {
  let basePrice = MARKET_PRICE;

  // Oil type adjustments
  if (oilType === "premium") basePrice += 0.02;
  if (oilType === "bio") basePrice += 0.04;

  // Volume discounts
  if (quantity >= 5000) basePrice -= 0.02;
  else if (quantity >= 3000) basePrice -= 0.01;

  // Provider multiplier
  const pricePerLiter = Math.round(basePrice * providerMultiplier * 1000) / 1000;
  const totalPrice = Math.round(pricePerLiter * quantity * 100) / 100;

  return { pricePerLiter, totalPrice };
}
