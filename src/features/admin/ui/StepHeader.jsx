function StepHeader({ step, title }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid place-content-center bg-black w-8 h-8 rounded-[16px] text-white font-degular text-xl">
        {step}
      </span>
      <span>-</span>
      <h2 className="text-black px-3 py-0.5 rounded-sm border border-[#B0B0B0] bg-[#E3E3E3]  ">
        {title}
      </h2>
    </div>
  );
}

export default StepHeader;
