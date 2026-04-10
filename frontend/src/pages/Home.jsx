import React from 'react';
// import SocialSidebar from "../components/SocialSidebar";
import HeroSection from '../components/HeroSection';
import Ticker from '../components/Ticker';
import Categories from '../components/Categories';
import LearningShowcase from '../components/LearningShowcase';
import CourseGrid from '../components/CourseGrid';
import CinematicPanel from '../components/CinematicPanel';
import IndustryLogos from '../components/IndustryLogos';
import CinematicPanel2 from '../components/CinematicPanel2';
import Testimonials from '../components/Testimonials';
import CinematicPanel3 from '../components/CinematicPanel3';
import TransformationSection from "../components/TransformationSection";
import CinematicPanel4 from '../components/CinematicPanel4';
import CareerSection from "../components/CareerSection";
import CourseGrid2 from '../components/CourseGrid2';

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
      <CourseGrid2 />
      <CinematicPanel2 />
      <Testimonials />
      <CinematicPanel3 />
      <TransformationSection />
      <CinematicPanel4 />
      <CareerSection />
    </>
  );
}
