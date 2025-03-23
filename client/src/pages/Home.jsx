import React from 'react'
import Header from '../componentes/Header'
import SpecialityMenu from '../componentes/SpecialityMenu'
import TopDoctors from '../componentes/TopDoctors'
import Banner from '../componentes/Banner'

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home
