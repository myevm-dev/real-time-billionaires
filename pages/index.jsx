import axios from "axios";
import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import NavBar from "@components/NavBar";

import shimmer from "@components/functions/shimmer";
import styles from "@components/styles/components/homepage.module.scss";
import { useState } from "react";

// Map country names to abbreviations
const countryAbbreviations = {
  "United States": "USA",
  "United Kingdom": "UK",
  "France": "FRA",
  "Germany": "GER",
  "Spain": "ESP",
  // Add more countries as needed
};

const numberFormat = (number, decimals, decimalSeparator, thousandsSeparator) => {
  if (number == null || !isFinite(number)) {
    throw new TypeError("number is not valid");
  }

  if (!decimals) {
    const len = number.toString().split(".").length;
    decimals = len > 1 ? len : 0;
  }

  if (!decimalSeparator) {
    decimalSeparator = ".";
  }

  if (!thousandsSeparator) {
    thousandsSeparator = ",";
  }

  number = parseFloat(number).toFixed(decimals);
  number = number.replace(".", decimalSeparator);

  const splitNum = number.split(decimalSeparator);
  splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  number = splitNum.join(decimalSeparator);

  return number;
};

export default function IndexPage({ lastUpdate, billionaires }) {
  const [selectedBillionaire, setSelectedBillionaire] = useState(null);

  const handleTrade = (billionaire) => {
    setSelectedBillionaire(billionaire);
  };

  const handleCloseModal = () => {
    setSelectedBillionaire(null);
  };

  const handleBuy = () => {
    console.log(`Buying shares of ${selectedBillionaire.personName}`);
    // Add buy functionality here
  };

  const handleSell = () => {
    console.log(`Selling shares of ${selectedBillionaire.personName}`);
    // Add sell functionality here
  };

  const getAbbreviatedCountry = (country) => {
    return countryAbbreviations[country] || country;
  };

  const resolveImageUrl = (url) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("http")) return url;
    return `https://${url}`;
  };

  return (
    <>
      <Head>
        <title>Real Time Billionaires</title>
      </Head>

      <NavBar />

      <div className={styles.container1}>
        <div className={styles.lastUpdate}>
          <div>Last update: {moment(lastUpdate).fromNow()}</div>
          <div>
            Source:{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.forbes.com/real-time-billionaires/"
            >
              Forbes
            </a>
          </div>
        </div>

        <div className={styles.billionaires}>
          {/* Top 20 Billionaires */}
          {billionaires.slice(0, 20).map((billionaire, key) => {
            const imageUrl = resolveImageUrl(billionaire.squareImage);
            const country = getAbbreviatedCountry(billionaire.countryOfCitizenship);

            return (
              <div key={key} className={styles.billionaire}>
                <div className={styles.image}>
                  <Image
                    width={50}
                    height={50}
                    src={imageUrl}
                    placeholder="blur"
                    blurDataURL={shimmer()}
                    alt={billionaire.personName}
                  />
                </div>

                <div className={styles.rank}>{billionaire.rank}</div>

                <div className={styles.fullName}>{billionaire.personName}</div>

                <div className={styles.source}>{billionaire.source}</div>

                <div className={styles.country}>{country}</div>

                <div className={styles.worth}>
                  ${numberFormat(billionaire.finalWorth / 1000, 2)} B
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.tradeButton}
                    onClick={() => handleTrade(billionaire)}
                  >
                    Trade
                  </button>
                </div>
              </div>
            );
          })}

          <hr className={styles.divider} />

          {/* Billionaires 21–30: In the Running */}
          <h2 className={styles.runningHeader}>In the Running</h2>
          {billionaires.slice(20, 30).map((billionaire, key) => {
            const imageUrl = resolveImageUrl(billionaire.squareImage);
            const country = getAbbreviatedCountry(billionaire.countryOfCitizenship);

            return (
              <div key={key + 20} className={styles.billionaire}>
                <div className={styles.image}>
                  <Image
                    width={50}
                    height={50}
                    src={imageUrl}
                    placeholder="blur"
                    blurDataURL={shimmer()}
                    alt={billionaire.personName}
                  />
                </div>

                <div className={styles.rank}>{billionaire.rank}</div>

                <div className={styles.fullName}>{billionaire.personName}</div>

                <div className={styles.source}>{billionaire.source}</div>

                <div className={styles.country}>{country}</div>

                <div className={styles.worth}>
                  ${numberFormat(billionaire.finalWorth / 1000, 2)} B
                </div>

                <div className={styles.actions}>
                  <button className={styles.lockedButton} disabled>
                    Locked
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedBillionaire && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              &times;
            </button>
            <div className={styles.modalHeader}>
              <h2>{selectedBillionaire.personName}</h2>
            </div>
            <div className={styles.modalBody}>
              <Image
                width={100}
                height={100}
                src={resolveImageUrl(selectedBillionaire.squareImage)}
                alt={selectedBillionaire.personName}
              />
              <p>
                <strong>Net Worth:</strong> $
                {numberFormat(selectedBillionaire.finalWorth / 1000, 2)} B
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.buyButton} onClick={handleBuy}>
                Buy
              </button>
              <button className={styles.sellButton} onClick={handleSell}>
                Sell
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const getStaticProps = async () => {
  const apiResult = await axios.get(
    "https://www.forbes.com/forbesapi/person/rtb/0/-estWorthPrev/true.json?fields=squareImage,rank,personName,finalWorth,birthDate,source,countryOfCitizenship"
  );
  const billionaires = apiResult.data.personList.personsLists.filter(
    (item, key) => key < 200
  );

  const lastUpdate = +new Date();

  return {
    revalidate: 10,
    props: {
      lastUpdate,
      billionaires,
    },
  };
};
