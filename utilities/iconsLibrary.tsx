import {
  ArchiveBoxXMarkIcon,
  ArrowDownTrayIcon,
  BackspaceIcon,
  BanknotesIcon,
  BellAlertIcon,
  BoltIcon,
  ChartBarSquareIcon,
  ChartPieIcon,
  ChatBubbleBottomCenterIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  Cog8ToothIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  FlagIcon,
  FolderOpenIcon,
  GlobeAltIcon,
  HashtagIcon,
  KeyIcon,
  LifebuoyIcon,
  LockClosedIcon,
  ServerIcon,
  ShieldCheckIcon,
  SignalIcon,
  Square3Stack3DIcon,
  SquaresPlusIcon,
  StarIcon,
  TagIcon,
  UserPlusIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

export const IconLibrary = [
  // i - Icon, k - Icon's Keywords
  {
    i: (cn: string) => <UserPlusIcon strokeWidth={1.3} className={cn} />,
    k: "User Plus Register",
  },
  {
    i: (cn: string) => (
      <ExclamationTriangleIcon strokeWidth={1.3} className={cn} />
    ),
    k: "Exclamation Triangle Error Warning",
  },
  {
    i: (cn: string) => <SignalIcon strokeWidth={1.3} className={cn} />,
    k: "Signal Webhooks",
  },
  {
    i: (cn: string) => <BanknotesIcon strokeWidth={1.3} className={cn} />,
    k: "Banknotes Money Payments",
  },
  {
    i: (cn: string) => <LifebuoyIcon strokeWidth={1.3} className={cn} />,
    k: "Support Help",
  },
  {
    i: (cn: string) => (
      <ChatBubbleBottomCenterIcon strokeWidth={1.3} className={cn} />
    ),
    k: "Support Help Chat",
  },
  {
    i: (cn: string) => (
      <HashtagIcon strokeWidth={1.3} className={`${cn} scale-y-90 `} />
    ),
    k: "hashtag",
  },
  {
    i: (cn: string) => <ArchiveBoxXMarkIcon strokeWidth={1.3} className={cn} />,
    k: "Archive Delete",
  },
  {
    i: (cn: string) => <ArrowDownTrayIcon strokeWidth={1.3} className={cn} />,
    k: "Arrow Down Download",
  },
  {
    i: (cn: string) => <BackspaceIcon strokeWidth={1.3} className={cn} />,
    k: "Backspace Delete Remove",
  },
  {
    i: (cn: string) => <BellAlertIcon strokeWidth={1.3} className={cn} />,
    k: "Bell Alert Notification",
  },
  {
    i: (cn: string) => <BoltIcon strokeWidth={1.3} className={cn} />,
    k: "Bolt Lightning",
  },
  {
    i: (cn: string) => <ChartBarSquareIcon strokeWidth={1.3} className={cn} />,
    k: "Charts Analytics",
  },
  {
    i: (cn: string) => <ChartPieIcon strokeWidth={1.3} className={cn} />,
    k: "Pie Charts Analytics",
  },
  {
    i: (cn: string) => <EyeIcon strokeWidth={1.3} className={cn} />,
    k: "Charts Eye Views",
  },
  {
    i: (cn: string) => <CircleStackIcon strokeWidth={1.3} className={cn} />,
    k: "Stack Database Server",
  },
  {
    i: (cn: string) => <CloudArrowUpIcon strokeWidth={1.3} className={cn} />,
    k: "Cloud Server Upload ",
  },
  {
    i: (cn: string) => <Cog8ToothIcon strokeWidth={1.3} className={cn} />,
    k: "Settings ",
  },
  {
    i: (cn: string) => (
      <WrenchScrewdriverIcon strokeWidth={1.3} className={cn} />
    ),
    k: "Wrench Settings ",
  },
  {
    i: (cn: string) => <TagIcon strokeWidth={1.3} className={cn} />,
    k: "Tag",
  },
  {
    i: (cn: string) => <StarIcon strokeWidth={1.3} className={cn} />,
    k: "Star",
  },
  {
    i: (cn: string) => <SquaresPlusIcon strokeWidth={1.3} className={cn} />,
    k: "Squares Plus",
  },
  {
    i: (cn: string) => <Square3Stack3DIcon strokeWidth={1.3} className={cn} />,
    k: "Squares 3D Stack",
  },
  {
    i: (cn: string) => <ShieldCheckIcon strokeWidth={1.3} className={cn} />,
    k: "Shield Protect DDoS",
  },
  {
    i: (cn: string) => <ServerIcon strokeWidth={1.3} className={cn} />,
    k: "Server Database",
  },

  {
    i: (cn: string) => <LockClosedIcon strokeWidth={1.3} className={cn} />,
    k: "Locked",
  },
  {
    i: (cn: string) => <KeyIcon strokeWidth={1.3} className={cn} />,
    k: "Key",
  },
  {
    i: (cn: string) => <GlobeAltIcon strokeWidth={1.3} className={cn} />,
    k: "Globe Earth",
  },
  {
    i: (cn: string) => <FlagIcon strokeWidth={1.3} className={cn} />,
    k: "Flag",
  },
  {
    i: (cn: string) => <FolderOpenIcon strokeWidth={1.3} className={cn} />,
    k: "Folder",
  },
];
