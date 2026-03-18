import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Link from 'next/link';

const Footer = () => {
  const navItems = [
    {
      title: 'Features',
      href: '#features',
    },
    {
      title: 'How it works',
      href: '#how',
    },
    {
      title: 'Login',
      href: PAGE_ROUTES.login,
    },
    {
      title: 'Sign Up',
      href: PAGE_ROUTES.register,
    },
  ];
  return (
    <footer className="border-border flex w-full flex-col items-center justify-center gap-2 md:gap-4 border-t py-4 md:flex-row">
      <a href="#" className="text-[18px] tracking-tighter">
        expen<em className="text-[#D47E30]">so</em>
      </a>

      <div className="">© 2026 Expenso. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
