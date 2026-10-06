/**
 * @file src/content/thanks.ts
 * @desc The /thanks list: people and projects the haruhime.moe tools lean on, and a player card
 *       snapshot for every osu! player named. The snapshots were read from osu! by hand (Sun Oct 4,
 *       2026; Boolmaster Flex, _Kooly, SverdWyrd, Rikii and tkn on Tue Oct 6, 2026) and are kept
 *       by hand; the site never calls osu!.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Tue Oct 6, 2026
 */

/** A player's osu! account as of the snapshot: what their card draws. */
export type ThanksOsuAccount = {
  /** The osu! user id: the avatar and the profile link. */
  id: number;
  /** ISO 3166-1 alpha-2 country code. */
  country: string;
  /** The profile cover's URL. */
  cover?: string;
  /** Their osu! team: its name and flag URL. */
  team?: { name: string; flag: string };
  /** They had osu!supporter on the snapshot day. */
  supporter?: boolean;
};

/** One player card: who, their osu! account when we're sure which it is, and what for. */
export type ThanksPlayer = {
  /** Their osu! name today, or the name David knows them by when there's no account. */
  username: string;
  /** Their osu! account. Left out when no account is confirmed: the card shows the name only. */
  osu?: ThanksOsuAccount;
  /** The card's bottom line: what they're thanked for, a few words. Left out when the entry's
   *  heading already says it (the Evergreen Cup staff). */
  role?: string;
  /** The name the entry's text uses, when they've renamed since. */
  formerly?: string;
};

/** One thanks entry: who, where to find them (optional), one line, and their player cards. */
export type ThanksEntry = {
  /** The person or project. */
  name: string;
  /** Where to find them: an https link (a test enforces it), or none. */
  url?: string;
  /** One short line on what they did. */
  line: string;
  /** A card for every osu! player the entry names, in its order. Projects have none. */
  players?: readonly ThanksPlayer[];
};

const CAFE = "osu!cafe";

/** Every person or project /thanks lists, one entry each, in this order. */
export const THANKS: readonly ThanksEntry[] = [
  {
    name: "-Tynamo, Varler, RMarc, and the Evergreen Cup Staff!",
    line: "Thanks for giving me a shot and the opportunity to work with all of you!",
    players: [
      {
        username: "-Tynamo",
        osu: {
          id: 3638962,
          country: "US",
          cover:
            "https://assets.ppy.sh/user-profile-covers/3638962/9152b41e56711061bbd90913c1518b7e4fced87f4072bf7da195520bcf7ae4a8.jpeg",
          team: {
            name: "Oregonians",
            flag: "https://assets.ppy.sh/teams/flag/281/5466d67d92f1932daadecf23dc358aa2c5025a2d67c1a077165a0a444ab8e051.png",
          },
          supporter: true,
        },
      },
      {
        username: "Varler",
        osu: {
          id: 2504750,
          country: "US",
          cover:
            "https://assets.ppy.sh/user-profile-covers/2504750/627b3772037bb64cd9b5448b1d021cb3ab978c1385b1e03579701eef4be7bbfb.gif",
          supporter: true,
        },
      },
      {
        username: "MikaXD",
        formerly: "RMarc",
        osu: {
          id: 2852816,
          country: "US",
          cover:
            "https://assets.ppy.sh/user-profile-covers/2852816/f8ab7516fe7e48818eaf98e3c066cae78862f719607535dc97db98a47294aca4.png",
          team: {
            name: "MikaXD",
            flag: "https://assets.ppy.sh/teams/flag/10806/adc2e5a81febe3c99cb48904875cc7f4918f34632df01684cb7ed752448910ea.jpeg",
          },
          supporter: true,
        },
      },
      {
        username: "Boolmaster Flex",
        osu: {
          id: 5394681,
          country: "US",
          cover:
            "https://assets.ppy.sh/user-profile-covers/5394681/ed462d3a9062ed5653078e6f86461586631e488c5077a8bfe3e8412183b6ee80.png",
          team: {
            name: "osu! Pass Players",
            flag: "https://assets.ppy.sh/teams/flag/2545/773542f8d4c0fb79aebc04d947ef38e826bbb368b7be4516e594e3ed0300af3c.png",
          },
          supporter: true,
        },
      },
      {
        username: "_Kooly",
        osu: {
          id: 6366148,
          country: "US",
          cover:
            "https://assets.ppy.sh/user-cover-presets/3/32ddb3eb261e38a82067f9ef4ea96c12f6abf8bd228e6413330f9d351420301b.jpeg",
        },
      },
    ],
  },
  {
    name: "Enslow, Sohlayce, Zyoulou, Drou, Tienei, SverdWyrd, Rikii",
    line: "and so many others from osu!cafe server! without you guys, who knows where my dev journey would be today in relation to osu!",
    players: [
      {
        username: "enslow",
        role: "my math tutor",
        osu: {
          id: 10651409,
          country: "US",
          cover:
            "https://assets.ppy.sh/user-profile-covers/10651409/2c1e29a92bbfef771f032ac5d0b2b03eed7215ae6983ff1d000d9e54fd467db3.jpeg",
          team: {
            name: "tsnerd",
            flag: "https://assets.ppy.sh/teams/flag/23746/fd14c8c2249f59c26255be2acac2c712d33d9887bfe47c7ef1253b25bfb2ca10.png",
          },
          supporter: true,
        },
      },
      {
        username: "ecalos",
        formerly: "Sohlayce",
        role: CAFE,
        osu: {
          id: 17649736,
          country: "US",
          cover:
            "https://assets.ppy.sh/user-profile-covers/17649736/8f15e1744cd9226e582777a6479b9e3fa907fd42b34b0a11caa1cd83b2fdc0e7.png",
          team: {
            name: "Maryland osu!",
            flag: "https://assets.ppy.sh/teams/flag/1851/601621a4a78d7dd2c987544ea173aee20e66ebe2fe0ae7de808c39008e23ab9d.jpeg",
          },
          supporter: true,
        },
      },
      {
        username: "Zyoulou",
        role: CAFE,
        osu: {
          id: 8668722,
          country: "CA",
          cover:
            "https://assets.ppy.sh/user-profile-covers/8668722/dac7a2f0d3e5b01514b492183319e5b58bb494e4c0e34b22e7ef097eb7f72fb3.gif",
        },
      },
      {
        username: "Drou",
        role: "c'est un moment de pog",
        osu: {
          id: 415932,
          country: "CA",
          cover:
            "https://assets.ppy.sh/user-profile-covers/415932/146dc325860be29506b0eed1a84c27e9f71cd6254c7f2dae98bd528e326409be.jpeg",
          team: {
            name: "MikaXD",
            flag: "https://assets.ppy.sh/teams/flag/10806/adc2e5a81febe3c99cb48904875cc7f4918f34632df01684cb7ed752448910ea.jpeg",
          },
        },
      },
      {
        username: "Tienei",
        role: CAFE,
        osu: {
          id: 11002548,
          country: "VN",
          cover:
            "https://assets.ppy.sh/user-profile-covers/11002548/4a64daf4000c6d48b7488420033055ba773877e84deb15a946b00446f4e6916e.jpeg",
        },
      },
      {
        username: "SverdWyrd",
        role: CAFE,
        osu: {
          id: 10996443,
          country: "FR",
          cover:
            "https://assets.ppy.sh/user-profile-covers/10996443/775dfe0dd17814bac2cddbb7e474b5b4b3cbd20d79a4486889387521ea281b34.jpeg",
        },
      },
      {
        username: "Rikii",
        role: CAFE,
        osu: {
          id: 3085123,
          country: "NL",
          cover:
            "https://assets.ppy.sh/user-profile-covers/3085123/ced1830ecaf640af51f00ad324295916a2e8ca68ddb0768bb35d7527b2aa5996.jpeg",
        },
      },
    ],
  },
  {
    name: "hburn7",
    url: "https://github.com/hburn7/omc-api",
    line: "omc-api, the mappool rules my compliance checks are ported from.",
    players: [
      {
        username: "Stage",
        role: "omc-api",
        osu: {
          id: 8191845,
          country: "US",
          cover:
            "https://assets.ppy.sh/user-profile-covers/8191845/9b7b4a42cc2b9907d52ea9c1436560b74d0f5da2cc5b348ddd318197110c42d8.jpeg",
        },
      },
    ],
  },
  {
    name: "Sheppsu",
    url: "https://otdb.sheppsu.me",
    line: "otdb, and the okay to list pools from its mappool export.",
    players: [
      {
        username: "Sheppsu",
        role: "otdb",
        osu: {
          id: 14895608,
          country: "US",
          cover:
            "https://assets.ppy.sh/user-profile-covers/14895608/859a7bda8ad09971013e5b7d1c619d1ca7b4cb0ee9caaaad8072a18973f3bad0.jpeg",
          team: {
            name: "Purdue",
            flag: "https://assets.ppy.sh/teams/flag/4207/5ba38d271ee9414dd57f8bde2d4784da0408ea4be840c02f99b297da821e4e33.png",
          },
          supporter: true,
        },
      },
    ],
  },
  {
    name: "token",
    url: "https://github.com/token03/bobert",
    line: "BoBERT, and the okay to use its map embeddings for similar-map suggestions in pools.",
    players: [
      {
        username: "tkn",
        formerly: "token",
        role: "BoBERT",
        osu: {
          id: 4881051,
          country: "CA",
          cover:
            "https://assets.ppy.sh/user-profile-covers/4881051/bcb1e94f081f6d72de9d9b3d7ea99de35d6830e48be07172e28213d1d6e9ed79.png",
          team: {
            name: "JungroanFanboys",
            flag: "https://assets.ppy.sh/teams/flag/830/e6dc72bd27a83bf53651b797d650719bd338a2b48306c18b4dfa893711f2cc3c.jpeg",
          },
        },
      },
    ],
  },
  {
    name: "the hinai beatmap mirror",
    url: "https://mirror.hinamizawa.ai",
    line: "serves the beatmap downloads, so I never host a file.",
  },
  {
    name: "ppy and the osu! team",
    url: "https://osu.ppy.sh",
    line: "osu! itself, and the API the tools read from.",
    players: [
      {
        username: "peppy",
        role: "osu!",
        osu: {
          id: 2,
          country: "AU",
          cover:
            "https://assets.ppy.sh/user-profile-covers/2/baba245ef60834b769694178f8f6d4f6166c5188c740de084656ad2b80f1eea7.jpeg",
          team: {
            name: "mom?",
            flag: "https://assets.ppy.sh/teams/flag/1/b46fb10dbfd8a35dc50e6c00296c0dc6172dffc3ed3d3a4b379277ba498399fe.png",
          },
          supporter: true,
        },
      },
    ],
  },
];
