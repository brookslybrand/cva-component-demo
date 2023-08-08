import { cva } from "class-variance-authority";
import { CheckCircleIcon, PlusIcon } from "@heroicons/react/20/solid";
import type { RequiredVariantProps } from "./types.ts";
import { checkEnv } from "./utils.ts";

type ButtonVariants = Omit<
  RequiredVariantProps<typeof buttonVariants>,
  "_content"
>;
const intents = [
  "primary",
  "secondary",
  "soft",
] satisfies ButtonVariants["intent"][];
const sizes = ["xs", "sm", "md", "lg", "xl"] satisfies ButtonVariants["size"][];
const iconPositions = ["leading", "trailing"] as const;

export default function Buttons() {
  return (
    <div className="w-fit space-y-8 px-8">
      {/* Intent + Size buttons */}
      {intents.map((intent) => (
        <ButtonWrapper key={intent}>
          {sizes.map((size) => (
            <Button key={size} intent={intent} size={size}>
              Button text
            </Button>
          ))}
        </ButtonWrapper>
      ))}

      {/* Icon buttons */}
      {iconPositions.map((iconPosition) => (
        <ButtonWrapper key={iconPosition}>
          {sizes.map((size) => {
            const iconProps =
              iconPosition === "leading"
                ? { leadingIcon: CheckCircleIcon }
                : { trailingIcon: CheckCircleIcon };
            return (
              <Button key={size} intent="primary" size={size} {...iconProps}>
                Button text
              </Button>
            );
          })}
        </ButtonWrapper>
      ))}

      {/* Rounded buttons */}
      {intents.map((intent) => (
        <ButtonWrapper key={intent}>
          {sizes.map((size) => (
            <Button key={size} intent={intent} size={size} rounded="full">
              Button text
            </Button>
          ))}
        </ButtonWrapper>
      ))}

      {/* Icon buttons */}
      {intents.map((intent) => (
        <ButtonWrapper key={intent}>
          {sizes.map((size) => (
            <IconButton
              key={size}
              intent={intent}
              size={size}
              icon={PlusIcon}
              hiddenLabel="Plus it!"
            />
          ))}
        </ButtonWrapper>
      ))}

      <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

      <PrimaryButtons />
      <SecondaryButtons />
      <SoftButtons />
      <ButtonsWithLeadingIcon />
      <ButtonsWithTrailingIcon />
      <RoundedPrimaryButtons />
      <RoundedSecondaryButtons />
      <CircularButtons />
    </div>
  );
}

type SVGComponent = React.ComponentType<React.SVGAttributes<SVGSVGElement>>;

type ButtonProps = Omit<Partial<ButtonVariants>, "icon"> &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  (
    | { leadingIcon?: SVGComponent; trailingIcon?: never }
    | { leadingIcon?: never; trailingIcon?: SVGComponent }
  );

function Button({
  className,
  intent,
  size,
  rounded,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  children,
  ...props
}: ButtonProps) {
  checkEnv("development", () => {
    if (LeadingIcon && TrailingIcon) {
      console.warn("You should only have a leading or trailing icon, not both");
    }
  });

  return (
    <button
      className={buttonVariants({
        className,
        intent,
        size,
        rounded,
        _content: LeadingIcon || TrailingIcon ? "textAndIcon" : "text",
      })}
      type="button"
      {...props}
    >
      {LeadingIcon ? (
        <LeadingIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      ) : null}
      {children}
      {TrailingIcon ? (
        <TrailingIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
      ) : null}
    </button>
  );
}

type IconButtonProps = Omit<
  ButtonProps,
  "rounded" | "leadingIcon" | "trailingIcon"
> & {
  icon: SVGComponent;
  hiddenLabel: string;
};

function IconButton({
  className,
  icon: Icon,
  hiddenLabel,
  intent,
  size,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={buttonVariants({
        className,
        intent,
        size,
        rounded: "full",
        _content: "icon",
      })}
      type="button"
      {...props}
    >
      <p className="sr-only">{hiddenLabel}</p>
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

const buttonVariants = cva(
  // 'font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600',
  "font-semibold shadow-sm",
  {
    variants: {
      intent: {
        primary: "bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900",
        secondary:
          "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100",
        soft: "bg-teal-50 text-teal-700 hover:bg-teal-100 active:bg-teal-200",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-sm",
        lg: "text-sm",
        xl: "text-sm",
      },
      rounded: {
        normal: "",
        full: "rounded-full",
      },
      _content: {
        text: "",
        textAndIcon: "inline-flex items-center gap-x-1.5",
        icon: "",
      },
    },
    compoundVariants: [
      { size: ["xs", "sm"], rounded: "normal", className: "rounded" },
      { size: ["md", "lg", "xl"], rounded: "normal", className: "rounded-md" },
      {
        _content: ["text", "textAndIcon"],
        size: ["xs", "sm"],
        className: "px-2 py-1",
      },
      {
        _content: ["text", "textAndIcon"],
        size: "md",
        className: "px-2.5 py-1.5",
      },
      {
        _content: ["text", "textAndIcon"],
        size: "lg",
        className: "px-3 py-2",
      },
      {
        _content: ["text", "textAndIcon"],
        size: "xl",
        className: "px-3.5 py-2.5",
      },
      { _content: "icon", size: "xs", className: "p-0.5" },
      { _content: "icon", size: "sm", className: "p-1" },
      { _content: "icon", size: "md", className: "p-1.5" },
      { _content: "icon", size: "lg", className: "p-2" },
      { _content: "icon", size: "xl", className: "p-2.5" },
    ],
    defaultVariants: {
      intent: "primary",
      size: "md",
      rounded: "normal",
      _content: "text",
    },
  }
);

function ButtonWrapper({ children }: { children: React.ReactNode }) {
  return <div className="space-x-8">{children}</div>;
}

function PrimaryButtons() {
  return (
    <ButtonWrapper>
      <button
        type="button"
        className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
      </button>
    </ButtonWrapper>
  );
}

function SecondaryButtons() {
  return (
    <ButtonWrapper>
      <button
        type="button"
        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Button text
      </button>
    </ButtonWrapper>
  );
}

function SoftButtons() {
  return (
    <ButtonWrapper>
      <button
        type="button"
        className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded bg-indigo-50 px-2 py-1 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-md bg-indigo-50 px-2.5 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
      >
        Button text
      </button>
    </ButtonWrapper>
  );
}

function ButtonsWithLeadingIcon() {
  return (
    <ButtonWrapper>
      <button
        type="button"
        className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Button text
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Button text
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Button text
      </button>
    </ButtonWrapper>
  );
}

function ButtonsWithTrailingIcon() {
  return (
    <ButtonWrapper>
      <button
        type="button"
        className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
        <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
        <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
        <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
      </button>
    </ButtonWrapper>
  );
}

function RoundedPrimaryButtons() {
  return (
    <ButtonWrapper>
      <button
        type="button"
        className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-full bg-indigo-600 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-full bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Button text
      </button>
    </ButtonWrapper>
  );
}

function RoundedSecondaryButtons() {
  return (
    <ButtonWrapper>
      <button
        type="button"
        className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Button text
      </button>
      <button
        type="button"
        className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Button text
      </button>
    </ButtonWrapper>
  );
}

function CircularButtons() {
  return (
    <ButtonWrapper>
      <button
        type="button"
        className="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="rounded-full bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </ButtonWrapper>
  );
}
