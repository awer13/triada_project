import React from 'react';
import { LANGUAGES } from '../utils/constants';
import { getTranslation } from '../utils/translations';
import Header from '../components/Header';
import LanguageCard from '../components/LanguageCard';
import InstructionStep from '../components/InstructionStep';

const Home: React.FC = () => {
  const lang = 'ru';

  return (
    <div className="min-h-screen dark-gradient pb-16">
      <div className="container mx-auto px-4 py-12">
        <Header title={getTranslation(lang, 'title')} />


        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-glow">
              {getTranslation(lang, 'title')}
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              {getTranslation(lang, 'about')}
            </p>
          </div>
        </section>

        <div className="my-24" />

        <section className="max-w-4xl mx-auto fade-in mb-24">
          <h3 className="text-xl font-semibold mb-8 text-center">
            Как это работает
          </h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <InstructionStep
              step={1}
              title={getTranslation(lang, 'uploadMedia')}
              icon="upload"
            />
            <InstructionStep
              step={2}
              title={getTranslation(lang, 'pasteText')}
              icon="text"
            />
          </div>
        </section>

        {/* Выбор языка */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-center text-slate-200">
              {getTranslation(lang, 'chooseLanguage')}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {LANGUAGES.map((language) => (
                <LanguageCard key={language.code} language={language} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;