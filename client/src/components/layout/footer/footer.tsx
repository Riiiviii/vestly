import Logo from '#/components/ui/logo'

function Footer() {
  return (
    <footer className="border-t border-(--border-color)">
      <div className="px-10 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-16 mb-10">
          <div className="w-full md:w-84">
            <Logo />
            <p className="text-base text-(--text-secondary) leading-relaxed mt-4">
              AI-powered stock analysis for everyday investors. Clear, honest,
              grounded in real data.
            </p>
          </div>
          <div className="w-full md:w-120">
            <h3 className="font-bold text-sm text-(--text-secondary) uppercase tracking-widest mb-3">
              Disclaimer
            </h3>
            <p className="text-base text-(--text-secondary) leading-relaxed">
              Vestly provides AI-generated analysis for informational purposes
              only. Nothing here constitutes financial advice. Always consult a
              licensed adviser before making investment decisions.
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-(--border-color) pt-6 mb-8">
          <p className="font-mono text-sm text-(--text-secondary)">
            &copy; {new Date().getFullYear()} Vestly
          </p>
          <p className="font-mono text-sm text-(--text-secondary)">
            Not financial advice
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
