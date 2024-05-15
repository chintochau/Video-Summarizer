import React, { useState } from "react";
import { tiers, useCheckout } from "../../contexts/CheckoutContext";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import CheckoutService from "../../services/CheckoutService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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

  const RenderComponent = ({ tier }) => {
    switch (tier.id) {
      case "credits":
        return <CreditsTier tier={tier} key={tier.id} />;
      default:
        return <PricingTier tier={tier} key={tier.id} frequency={frequency} />;
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing plans for your needs
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan that’s packed with the best features for
          your needs.
        </p>
        <div className="mt-16 flex justify-center">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
          >
            <RadioGroup.Label className="sr-only">
              Payment frequency
            </RadioGroup.Label>
            {frequencies.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={({ checked }) =>
                  classNames(
                    checked ? "bg-indigo-600 text-white" : "text-gray-500",
                    "cursor-pointer rounded-full px-2.5 py-1"
                  )
                }
              >
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
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
  const {userId} = useAuth()
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
    <div
      key={tier.id}
      className={classNames(
        tier.mostPopular ? "ring-2 ring-indigo-600" : "ring-1 ring-gray-200",
        "rounded-3xl p-8 xl:p-10"
      )}
    >
      <div className="flex items-center justify-between gap-x-4">
        <h3
          id={tier.id}
          className={classNames(
            tier.mostPopular ? "text-indigo-600" : "text-gray-900",
            "text-lg font-semibold leading-8"
          )}
        >
          {tier.name}
        </h3>
        {tier.mostPopular ? (
          <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
            Most popular
          </p>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
      <div className="mt-6 items-baseline gap-x-1">
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
                    checked ? "bg-indigo-600 text-white" : "text-gray-500",
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
            ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
            : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
          "mt-2 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
              className="h-6 w-5 flex-none text-indigo-600 whitespace-break-spaces"
              aria-hidden="true"
            />
            <div className=" whitespace-break-spaces">{feature}</div>
          </li>
        ))}
      </ul>
    </div>
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
    <div
      key={tier.id}
      className={classNames(
        tier.mostPopular ? "ring-2 ring-indigo-600" : "ring-1 ring-gray-200",
        "rounded-3xl p-8 xl:p-10"
      )}
    >
      <div className="flex items-center justify-between gap-x-4">
        <h3
          id={tier.id}
          className={classNames(
            tier.mostPopular ? "text-indigo-600" : "text-gray-900",
            "text-lg font-semibold leading-8"
          )}
        >
          {tier.name}
        </h3>
        {tier.mostPopular ? (
          <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
            Most popular
          </p>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
      <p className="mt-6 flex items-baseline gap-x-1">
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
            ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
            : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
          "mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-500 disabled:text-white disabled:ring-gray-500"
        )}
        disabled={!tier.available}
        onClick={() =>
          selectPlan({
            id: tier.id,
            price: tier.price[frequency.value],
            itemName: `${tier.itemName} (${frequency.label})`
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
              className="h-6 w-5 flex-none text-indigo-600"
              aria-hidden="true"
            />
            <div className=" whitespace-break-spaces">{feature}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingPlans;
