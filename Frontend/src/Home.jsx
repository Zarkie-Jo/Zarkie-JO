import Reviews from "./component/Reviews/Reviews";
import StepGuide from "./component/StepGuide/StepGuide";

const Home = () => {
  return (
    <main className="bg-white font-josefin">
      <Reviews />
      <StepGuide />
      {/* <OurServices /> */}
      <our />
    </main>
  );
};

export default Home;
