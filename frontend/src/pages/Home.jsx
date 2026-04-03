import React from 'react';
// import SocialSidebar from "../components/SocialSidebar";
import HeroSection from '../components/HeroSection';
import Ticker from '../components/Ticker';
import Categories from '../components/Categories';
import LearningShowcase from '../components/LearningShowcase';
import CourseGrid from '../components/CourseGrid';
import CinematicPanel from '../components/CinematicPanel';
import IndustryLogos from '../components/IndustryLogos';
import Instructors from '../components/Instructors';
import CinematicPanel2 from '../components/CinematicPanel2';
import Testimonials from '../components/Testimonials';
import CinematicPanel3 from '../components/CinematicPanel3';
import TransformationSection from "../components/TransformationSection";
import CinematicPanel4 from '../components/CinematicPanel4';
import CareerSection from "../components/CareerSection";


export default function Home() {
  return (
    <>
     {/* <SocialSidebar /> */}
      <HeroSection />
      <Ticker />
      <Categories />
      <LearningShowcase />
      <CourseGrid />
      <CinematicPanel />
      <IndustryLogos />
      <Instructors />
      <CinematicPanel2 />
      <Testimonials />
      <CinematicPanel3 />
      <TransformationSection />
      <CinematicPanel4 />
      <CareerSection />
    </>
  );
}
