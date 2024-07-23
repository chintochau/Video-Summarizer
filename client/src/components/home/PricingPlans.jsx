import React, { useState } from "react";
import { tiers, useCheckout } from "../../contexts/CheckoutContext";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import CheckoutService from "../../services/CheckoutService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month", amount: 1 },
  {
    value: "annually",
    label: "Annually (20% Off)",
    priceSuffix: "/year (20% Off)",
    amount: 12,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PricingPlans = () => {
  const [frequency, setFrequency] = useState(frequencies[0]);
  const { t } = useTranslation();

  const plans = t("pricingContents.plans", { returnObjects: true });

  const RenderComponent = ({ tier }) => {
    switch (tier.id) {
      case "credits":
        return <CreditsTier tier={tier} key={tier.id} />;
      default:
        return <PricingTier tier={tier} key={tier.id} frequency={frequency} />;
    }
  };

  return (
    <div className="bg-white py-16  sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl sm:text-center text-left">
          <h2 className="text-3xl font-extrabold leading-8 text-cyan-700/70 sm:text-4xl sm:leading-10 ">
            Pricing Plans
          </h2>
          <p className="text-sm md:text-xl text-gray-800 font-roboto font-normal max-w-3xl mt-4 mx-auto">
            Choose an affordable plan that’s packed with the best features for
            your needs.
          </p>
        </div>
        <div className=" mt-6 md:mt-10 flex justify-center">
          <Tabs defaultValue={frequencies[0].value}>
            <TabsList className="lg:mx-6 lg:mt-2 lg:mb-5 md:py-5 bg-transparent border px-0 rounded-xl">
              {frequencies.map((option) => (
                <TabsTrigger
                  className="data-[state=active]:bg-cyan-600/70 data-[state=active]:text-white data-[state=active]:hover:bg-cyan-800 data-[state=active]:hover:text-white border mx-1 rounded-lg hover:bg-cyan-100 hover:text-cyan-900 hover:border-cyan-200"
                  key={option.value}
                  value={option.value}
                  onClick={() => setFrequency(option)}
                >
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="isolate mx-auto mt-6 grid max-w-md grid-cols-1 gap-x-14 gap-y-10 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {tiers.map((tier) => RenderComponent({ tier }))}
        </div>
      </div>
    </div>
  );
};

const CreditsTier = ({ tier }) => {
  const { priceOptions, features } = tier;
  const [creditsToBuy, setCreditsToBuy] = useState(tiers[0].priceOptions[0]);
  const { setSelectedPlan } = useCheckout();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const selectPlan = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    const plan = {
      id: "credits",
      amount: creditsToBuy.value,
      price: creditsToBuy.price,
      itemName: "Fusion AI Credits",
      detail: creditsToBuy.featureList,
      userId,
    };
    setSelectedPlan(plan);
    const paymentUrl = await CheckoutService.processPayment(plan);
    window.location.href = paymentUrl;
  };

  return (
    <Card
      key={tier.id}
      className={classNames(
        tier.mostPopular ? "ring-2 ring-cyan-600" : "ring-1 ring-gray-200",
        "rounded-3xl p-8 xl:p-10"
      )}
    >
      <CardHeader>
        <CardTitle id={tier.id}>{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" items-baseline gap-x-1">
          <div className="text-4xl font-bold tracking-tight text-gray-900">
            ${creditsToBuy.price}
          </div>
          <div className="mt-4 flex">
            <RadioGroup
              className="w-full grid grid-cols-2 gap-x-1 rounded-md p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
              onChange={setCreditsToBuy}
              value={creditsToBuy}
            >
              <RadioGroup.Label className="sr-only">
                Payment frequency
              </RadioGroup.Label>
              {priceOptions.map((option) => (
                <RadioGroup.Option
                  key={option.value}
                  value={option}
                  className={({ checked }) =>
                    classNames(
                      checked ? "bg-cyan-600 text-white" : "text-gray-500",
                      "cursor-pointer rounded-md px-2.5 py-1"
                    )
                  }
                >
                  <span>{option.value} Credits</span>
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>
        </div>
        <button
          aria-describedby={tier.id}
          className={classNames(
            tier.mostPopular
              ? "bg-cyan-600 text-white shadow-sm hover:bg-cyan-500"
              : "text-cyan-600 ring-1 ring-inset ring-cyan-200 hover:ring-cyan-300",
            "mt-2 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          )}
          onClick={selectPlan}
        >
          Buy Credits
        </button>
        <ul
          role="list"
          className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
        >
          {creditsToBuy.featureList.map((feature) => (
            <li key={feature} className="flex gap-x-3">
              <CheckIcon
                className="h-6 w-5 flex-none text-cyan-600 whitespace-break-spaces"
                aria-hidden="true"
              />
              <div className=" whitespace-break-spaces">{feature}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const PricingTier = ({ tier, frequency }) => {
  const { setSelectedPlan } = useCheckout();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const selectPlan = async ({ id, price, itemName }) => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const plan = {
      id,
      amount: frequency.amount,
      price,
      itemName,
      userId,
    };
    setSelectedPlan(plan);
    const paymentUrl = await CheckoutService.processPayment(plan);
    window.location.href = paymentUrl;
  };

  return (
    <Card
      key={tier.id}
      className={classNames( "rounded-3xl p-8 xl:p-10 ")}
    >
      <CardHeader>
        <CardTitle id={tier.id}>{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="flex items-baseline gap-x-1">
          <span className="text-4xl font-bold tracking-tight text-gray-900">
            ${tier.price[frequency.value]}
          </span>
          <span className="text-sm font-semibold leading-6 text-gray-600">
            {frequency.priceSuffix}
          </span>
        </p>

        <button
          aria-describedby={tier.id}
          className={classNames(
            tier.mostPopular
              ? "bg-cyan-600 text-white shadow-sm hover:bg-cyan-500"
              : "text-cyan-600 ring-1 ring-inset ring-cyan-200 hover:ring-cyan-300",
            "mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:bg-gray-500 disabled:text-white disabled:ring-gray-500"
          )}
          disabled={!tier.available}
          onClick={() =>
            selectPlan({
              id: tier.id,
              price: tier.price[frequency.value],
              itemName: `${tier.itemName} (${frequency.label})`,
            })
          }
        >
          {tier.available ? "Buy plan" : "Not available"}
        </button>
        <ul
          role="list"
          className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
        >
          {tier.features.map((feature) => (
            <li key={feature} className="flex gap-x-3">
              <CheckIcon
                className="h-6 w-5 flex-none text-cyan-600"
                aria-hidden="true"
              />
              <div className=" whitespace-break-spaces">{feature}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PricingPlans;
