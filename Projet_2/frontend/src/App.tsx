import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Shop } from './pages/Shop';
import { Backpack } from './pages/Backpack';
import { Mint } from './pages/Mint';
import { Trade } from './pages/Trade';
import {MainLayout} from './Layouts/MainLayout';
import {ShopLayout} from './Layouts/ShopLayout';
import {MintLayout} from './Layouts/MintLayout';
import {BackPackLayout} from './Layouts/BackPackLayout';
import {TradeLayout} from './Layouts/TradeLayout';


import { useEffect, useMemo, useRef, useState } from 'react';
import * as ethereum from '@/lib/ethereum';
import * as main from '@/lib/main';


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
  
    const [refreshTrigger, setRefreshTrigger] = useState(false)

  // 当商城购买成功时，切换 refreshTrigger 来触发背包刷新
  const handlePurchaseSuccess = () => {
    setRefreshTrigger(!refreshTrigger)  // 切换状态来触发背包刷新
  }

  



  return (
      <Router>

          <Routes>
            <Route path="/" element={ <MainLayout>   </MainLayout>} />
            <Route path="/shop" element={<ShopLayout> <Shop onPurchaseSuccess={handlePurchaseSuccess} /> </ShopLayout>} />
            <Route path="/backpack" element={<BackPackLayout> <Backpack refreshTrigger={refreshTrigger} /> </BackPackLayout>} />
            <Route path="/mint" element={<MintLayout> <Mint /> </MintLayout>} />
            <Route path="/trade" element={<TradeLayout><Trade /> </TradeLayout>} />
          </Routes>

      </Router>
  );
};



