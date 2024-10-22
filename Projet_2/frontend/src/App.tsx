import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Shop } from './pages/Shop';
import { Backpack } from './pages/Backpack';
import { Mint } from './pages/Mint';
import { Trade } from './pages/Trade';
import {MainLayout} from './Layouts/MainLayout';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import * as ethereum from '@/lib/ethereum';
import * as main from '@/lib/main';

import logo from './Img_src/Logo.png';
import pokemonBall from './Img_src/PokemonBall.png';

type Canceler = () => void;
const useAffect = (
    asyncEffect: () => Promise<Canceler | void>,
    dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>();
  useEffect(() => {
    asyncEffect()
        .then(canceler => (cancelerRef.current = canceler))
        .catch(error => console.warn('Uncatched error', error));
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current();
        cancelerRef.current = undefined;
      }
    };
  }, dependencies);
};

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>();
  const [contract, setContract] = useState<main.Main>();
  useAffect(async () => {
    const details_ = await ethereum.connect('metamask');
    if (!details_) return;
    setDetails(details_);
    const contract_ = await main.init(details_);
    if (!contract_) return;
    setContract(contract_);
  }, []);
  return useMemo(() => {
    if (!details || !contract) return;
    return { details, contract };
  }, [details, contract]);
};

export const App = () => {


  return (
      <Router>
            <MainLayout>
              <Routes>
                <Route path="/shop" element={<Shop />} />
                <Route path="/backpack" element={<Backpack />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/trade" element={<Trade />} />
              </Routes>
            </MainLayout>
      </Router>
  );
};
