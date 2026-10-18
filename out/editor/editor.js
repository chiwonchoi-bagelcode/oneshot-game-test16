(() => {
  // src/data/balance.json
  var balance_default = {
    _comment: "All tunable numbers live here. Physics units: world units (~px at zoom 1), seconds. 1 m shown to the player = metersPerUnit.",
    display: {
      unitsPerMeter: 10
    },
    physics: {
      gravity: 1500,
      pressGravityMul: 1.9,
      airPressGravityMul: 3,
      groundFriction: 30,
      airDrag: 4e-5,
      groundDrag: 1e-4,
      minSpeed: 260,
      maxSpeed: 3e3,
      startSpeed: 420,
      radius: 40,
      perfectAngle: 0.36,
      perfectMinDownSlope: 0.12,
      perfectBoost: 1.08,
      bonkAngle: 0.95,
      bonkKeep: 0.62,
      bonkStun: 0.35,
      landKeep: 0.97,
      feverChain: 3,
      feverTime: 6,
      feverSpeedMul: 1.18,
      feverBlizzardPush: 700,
      iceAccelMul: 1.35,
      iceFrictionMul: 0.15,
      cloudBounce: 0.35,
      windAccel: 2600,
      geyserImpulse: 1700,
      ringBoost: 1.22,
      heightMilestones: [
        40,
        80,
        150,
        250,
        400,
        600
      ],
      heightMilestoneFish: [
        2,
        4,
        6,
        10,
        15,
        25
      ]
    },
    upgrades: {
      flap: {
        order: 1,
        maxLevel: 10,
        baseCost: 20,
        costGrowth: 1.52,
        values: [
          0,
          0.18,
          0.3,
          0.4,
          0.48,
          0.55,
          0.61,
          0.66,
          0.7,
          0.74,
          0.78
        ],
        unlock: {
          runs: 1
        }
      },
      slide: {
        order: 2,
        maxLevel: 10,
        baseCost: 35,
        costGrowth: 1.52,
        values: [
          0,
          0.08,
          0.15,
          0.21,
          0.26,
          0.3,
          0.34,
          0.37,
          0.4,
          0.43,
          0.45
        ],
        unlock: {
          runs: 2
        }
      },
      magnet: {
        order: 3,
        maxLevel: 8,
        baseCost: 60,
        costGrowth: 1.55,
        values: [
          0,
          70,
          100,
          130,
          160,
          190,
          220,
          250,
          280
        ],
        unlock: {
          island: 2
        }
      },
      glide: {
        order: 4,
        maxLevel: 8,
        baseCost: 110,
        costGrowth: 1.55,
        values: [
          0,
          0.1,
          0.17,
          0.23,
          0.28,
          0.32,
          0.35,
          0.38,
          0.41
        ],
        unlock: {
          island: 3
        }
      },
      scarf: {
        order: 5,
        maxLevel: 5,
        baseCost: 250,
        costGrowth: 1.8,
        values: [
          0,
          1,
          1,
          2,
          2,
          3
        ],
        pushback: [
          0,
          600,
          900,
          900,
          1200,
          1200
        ],
        unlock: {
          island: 4
        }
      }
    },
    blizzard: {
      maxGap: 1500,
      dangerGap: 520,
      rubberBandMul: 2.2,
      tutorialDelay: 9
    },
    economy: {
      fishValue: 1,
      goldFishValue: 10,
      distanceFishPerMeter: 0.025,
      islandFirstBonus: [
        0,
        0,
        60,
        120,
        200,
        300,
        420,
        560,
        720,
        900,
        1100
      ],
      islandRepeatBonus: 0.15,
      populationBonusPerPenguin: 0.01
    }
  };

  // src/data/levels/island01.json
  var island01_default = {
    id: "island01",
    name: {
      ko: "\uCCAB \uB208\uBC2D",
      en: "First Snow"
    },
    biome: "dawn",
    surface: "snow",
    intro: null,
    points: [
      [
        0,
        520
      ],
      [
        568,
        -200
      ],
      [
        1145,
        206
      ],
      [
        1728,
        -191
      ],
      [
        2354,
        211
      ],
      [
        2928,
        -181
      ],
      [
        3526,
        183
      ],
      [
        4145,
        -265
      ],
      [
        4715,
        263
      ],
      [
        5301,
        -279
      ],
      [
        5849,
        202
      ],
      [
        6505,
        -307
      ],
      [
        7172,
        160
      ],
      [
        7756,
        -359
      ],
      [
        8328,
        140
      ],
      [
        8679,
        -188
      ],
      [
        9054,
        8
      ],
      [
        9392,
        -204
      ],
      [
        9704,
        -30
      ],
      [
        10336,
        -326
      ],
      [
        10918,
        114
      ],
      [
        11516,
        -291
      ],
      [
        12100,
        153
      ],
      [
        12694,
        -341
      ],
      [
        13310,
        176
      ],
      [
        14192,
        -432
      ],
      [
        15008,
        336
      ],
      [
        15616,
        -262
      ],
      [
        16211,
        238
      ],
      [
        16827,
        -301
      ],
      [
        17475,
        216
      ],
      [
        18117,
        -295
      ],
      [
        18797,
        202
      ],
      [
        19437,
        -200
      ],
      [
        20257,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 1269,
        y: 287
      },
      {
        type: "single",
        x: 1365,
        y: 255
      },
      {
        type: "single",
        x: 1459,
        y: 178
      },
      {
        type: "single",
        x: 1553,
        y: 57
      },
      {
        type: "single",
        x: 3732,
        y: 212
      },
      {
        type: "single",
        x: 3830,
        y: 137
      },
      {
        type: "single",
        x: 3928,
        y: 40
      },
      {
        type: "single",
        x: 4024,
        y: -93
      },
      {
        type: "single",
        x: 7316,
        y: 257
      },
      {
        type: "single",
        x: 7418,
        y: 264
      },
      {
        type: "single",
        x: 7518,
        y: 256
      },
      {
        type: "single",
        x: 7619,
        y: 233
      },
      {
        type: "single",
        x: 7719,
        y: 195
      },
      {
        type: "single",
        x: 7819,
        y: 136
      },
      {
        type: "single",
        x: 7918,
        y: 38
      },
      {
        type: "single",
        x: 9190,
        y: 87
      },
      {
        type: "single",
        x: 9279,
        y: 102
      },
      {
        type: "single",
        x: 9367,
        y: 101
      },
      {
        type: "single",
        x: 9455,
        y: 86
      },
      {
        type: "single",
        x: 9543,
        y: 55
      },
      {
        type: "single",
        x: 13452,
        y: 285
      },
      {
        type: "single",
        x: 13542,
        y: 271
      },
      {
        type: "single",
        x: 13631,
        y: 213
      },
      {
        type: "single",
        x: 13719,
        y: 127
      },
      {
        type: "single",
        x: 13807,
        y: 26
      },
      {
        type: "single",
        x: 13895,
        y: -89
      },
      {
        type: "single",
        x: 13982,
        y: -218
      },
      {
        type: "single",
        x: 16380,
        y: 279
      },
      {
        type: "single",
        x: 16463,
        y: 230
      },
      {
        type: "single",
        x: 16544,
        y: 139
      },
      {
        type: "single",
        x: 16626,
        y: 3
      },
      {
        type: "single",
        x: 18939,
        y: 293
      },
      {
        type: "single",
        x: 19028,
        y: 279
      },
      {
        type: "single",
        x: 19116,
        y: 227
      },
      {
        type: "single",
        x: 19204,
        y: 131
      },
      {
        type: "single",
        x: 19291,
        y: -9
      },
      {
        type: "single",
        x: 1910,
        y: 904
      },
      {
        type: "single",
        x: 2031,
        y: 938
      },
      {
        type: "single",
        x: 2152,
        y: 957
      },
      {
        type: "single",
        x: 2272,
        y: 961
      },
      {
        type: "single",
        x: 2391,
        y: 951
      },
      {
        type: "single",
        x: 2510,
        y: 929
      },
      {
        type: "single",
        x: 2629,
        y: 895
      },
      {
        type: "single",
        x: 4643,
        y: 327
      },
      {
        type: "single",
        x: 4742,
        y: 463
      },
      {
        type: "single",
        x: 4840,
        y: 583
      },
      {
        type: "single",
        x: 4938,
        y: 688
      },
      {
        type: "single",
        x: 5036,
        y: 777
      },
      {
        type: "single",
        x: 5133,
        y: 851
      },
      {
        type: "single",
        x: 5230,
        y: 909
      },
      {
        type: "single",
        x: 8180,
        y: 1162
      },
      {
        type: "single",
        x: 8260,
        y: 1196
      },
      {
        type: "single",
        x: 8340,
        y: 1225
      },
      {
        type: "single",
        x: 8421,
        y: 1250
      },
      {
        type: "single",
        x: 8500,
        y: 1272
      },
      {
        type: "single",
        x: 8580,
        y: 1290
      },
      {
        type: "single",
        x: 8660,
        y: 1304
      },
      {
        type: "single",
        x: 9827,
        y: 1111
      },
      {
        type: "single",
        x: 9903,
        y: 1074
      },
      {
        type: "single",
        x: 9979,
        y: 1033
      },
      {
        type: "single",
        x: 10054,
        y: 989
      },
      {
        type: "single",
        x: 10130,
        y: 943
      },
      {
        type: "single",
        x: 10205,
        y: 893
      },
      {
        type: "single",
        x: 10280,
        y: 841
      },
      {
        type: "single",
        x: 12055,
        y: 267
      },
      {
        type: "single",
        x: 12138,
        y: 365
      },
      {
        type: "single",
        x: 12221,
        y: 454
      },
      {
        type: "single",
        x: 12304,
        y: 539
      },
      {
        type: "single",
        x: 12386,
        y: 618
      },
      {
        type: "single",
        x: 12468,
        y: 686
      },
      {
        type: "single",
        x: 12549,
        y: 743
      },
      {
        type: "single",
        x: 14286,
        y: 1032
      },
      {
        type: "single",
        x: 14362,
        y: 1006
      },
      {
        type: "single",
        x: 14439,
        y: 977
      },
      {
        type: "single",
        x: 14515,
        y: 946
      },
      {
        type: "single",
        x: 14591,
        y: 910
      },
      {
        type: "single",
        x: 14666,
        y: 864
      },
      {
        type: "single",
        x: 14742,
        y: 807
      },
      {
        type: "single",
        x: 16945,
        y: 1444
      },
      {
        type: "single",
        x: 17044,
        y: 1564
      },
      {
        type: "single",
        x: 17143,
        y: 1680
      },
      {
        type: "single",
        x: 17241,
        y: 1791
      },
      {
        type: "single",
        x: 17339,
        y: 1899
      },
      {
        type: "single",
        x: 17436,
        y: 2002
      },
      {
        type: "single",
        x: 17533,
        y: 2101
      },
      {
        type: "single",
        x: 18664,
        y: 2967
      },
      {
        type: "single",
        x: 18757,
        y: 3013
      },
      {
        type: "single",
        x: 18848,
        y: 3056
      },
      {
        type: "single",
        x: 18940,
        y: 3094
      },
      {
        type: "single",
        x: 19031,
        y: 3129
      },
      {
        type: "single",
        x: 19122,
        y: 3159
      },
      {
        type: "single",
        x: 19212,
        y: 3186
      },
      {
        type: "ground",
        x: 120,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 1265,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 2474,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 3646,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 7292,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 9824,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 15128,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "arc",
        x: 15088,
        y: 896,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      }
    ],
    blizzard: {
      startGap: 1100,
      speed: 480,
      accel: 5
    },
    expect: {
      upgrades: {}
    },
    goals: [
      {
        type: "fish",
        n: 60
      },
      {
        type: "perfect",
        n: 5
      }
    ],
    ice: [],
    wind: [],
    geysers: [],
    rings: [],
    decor: [
      {
        type: "sign",
        x: 340
      },
      {
        type: "pine",
        x: 700,
        s: 0.82,
        v: 2
      },
      {
        type: "rock",
        x: 1397,
        s: 0.97,
        v: 1
      },
      {
        type: "crystal",
        x: 1851,
        s: 0.93,
        v: 0
      },
      {
        type: "pine",
        x: 2438,
        s: 1.03,
        v: 1
      },
      {
        type: "rock",
        x: 2879,
        s: 0.98,
        v: 2
      },
      {
        type: "crystal",
        x: 3287,
        s: 0.97,
        v: 1
      },
      {
        type: "pine",
        x: 3708,
        s: 0.79,
        v: 2
      },
      {
        type: "pine",
        x: 4316,
        s: 0.9,
        v: 1
      },
      {
        type: "crystal",
        x: 4897,
        s: 0.93,
        v: 0
      },
      {
        type: "rock",
        x: 5442,
        s: 0.91,
        v: 1
      },
      {
        type: "crystal",
        x: 6028,
        s: 0.86,
        v: 0
      },
      {
        type: "rock",
        x: 6584,
        s: 0.82,
        v: 2
      },
      {
        type: "pine",
        x: 7306,
        s: 1.01,
        v: 0
      },
      {
        type: "crystal",
        x: 7803,
        s: 0.85,
        v: 0
      },
      {
        type: "pine",
        x: 8295,
        s: 1.09,
        v: 2
      },
      {
        type: "pine",
        x: 8913,
        s: 0.98,
        v: 2
      },
      {
        type: "rock",
        x: 9566,
        s: 0.89,
        v: 1
      },
      {
        type: "pine",
        x: 10199,
        s: 0.93,
        v: 1
      },
      {
        type: "rock",
        x: 10688,
        s: 0.76,
        v: 0
      },
      {
        type: "crystal",
        x: 11225,
        s: 0.77,
        v: 2
      },
      {
        type: "crystal",
        x: 11831,
        s: 0.88,
        v: 0
      },
      {
        type: "rock",
        x: 12304,
        s: 0.97,
        v: 0
      },
      {
        type: "crystal",
        x: 12786,
        s: 0.78,
        v: 1
      },
      {
        type: "crystal",
        x: 13423,
        s: 0.94,
        v: 0
      },
      {
        type: "rock",
        x: 14046,
        s: 1.03,
        v: 1
      },
      {
        type: "pine",
        x: 14644,
        s: 1.06,
        v: 1
      },
      {
        type: "pine",
        x: 15026,
        s: 1.04,
        v: 2
      },
      {
        type: "rock",
        x: 15748,
        s: 0.96,
        v: 0
      },
      {
        type: "pine",
        x: 16358,
        s: 0.95,
        v: 0
      },
      {
        type: "rock",
        x: 16991,
        s: 0.77,
        v: 1
      },
      {
        type: "crystal",
        x: 17470,
        s: 1.06,
        v: 2
      },
      {
        type: "rock",
        x: 18015,
        s: 0.93,
        v: 0
      },
      {
        type: "pine",
        x: 18631,
        s: 0.97,
        v: 1
      },
      {
        type: "rock",
        x: 19216,
        s: 0.84,
        v: 1
      },
      {
        type: "snowman",
        x: 9116,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 20217
      }
    ]
  };

  // src/data/levels/island02.json
  var island02_default = {
    id: "island02",
    name: {
      ko: "\uC18C\uB098\uBB34 \uC5B8\uB355",
      en: "Pine Ridge"
    },
    biome: "pine",
    surface: "snow",
    intro: null,
    points: [
      [
        0,
        520
      ],
      [
        593,
        -291
      ],
      [
        1179,
        246
      ],
      [
        1796,
        -258
      ],
      [
        2391,
        211
      ],
      [
        2998,
        -273
      ],
      [
        3618,
        178
      ],
      [
        4307,
        -381
      ],
      [
        4990,
        248
      ],
      [
        5640,
        -405
      ],
      [
        6246,
        249
      ],
      [
        6948,
        -365
      ],
      [
        7636,
        205
      ],
      [
        8568,
        -414
      ],
      [
        9544,
        316
      ],
      [
        9883,
        -188
      ],
      [
        10222,
        35
      ],
      [
        10539,
        -222
      ],
      [
        10842,
        7
      ],
      [
        11164,
        -196
      ],
      [
        11490,
        31
      ],
      [
        12149,
        -348
      ],
      [
        12750,
        142
      ],
      [
        13398,
        -315
      ],
      [
        14084,
        179
      ],
      [
        14679,
        -367
      ],
      [
        15316,
        156
      ],
      [
        16235,
        -479
      ],
      [
        17215,
        279
      ],
      [
        17934,
        -412
      ],
      [
        18621,
        226
      ],
      [
        19293,
        -418
      ],
      [
        20002,
        223
      ],
      [
        20675,
        -412
      ],
      [
        21380,
        236
      ],
      [
        22037,
        -312
      ],
      [
        22716,
        195
      ],
      [
        23363,
        -283
      ],
      [
        24016,
        167
      ],
      [
        24656,
        -200
      ],
      [
        25476,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 2406,
        y: 349
      },
      {
        type: "single",
        x: 2510,
        y: 444
      },
      {
        type: "single",
        x: 2612,
        y: 525
      },
      {
        type: "single",
        x: 2714,
        y: 590
      },
      {
        type: "single",
        x: 2816,
        y: 639
      },
      {
        type: "single",
        x: 2917,
        y: 674
      },
      {
        type: "single",
        x: 3017,
        y: 693
      },
      {
        type: "single",
        x: 4969,
        y: 388
      },
      {
        type: "single",
        x: 5077,
        y: 516
      },
      {
        type: "single",
        x: 5184,
        y: 627
      },
      {
        type: "single",
        x: 5291,
        y: 724
      },
      {
        type: "single",
        x: 5397,
        y: 804
      },
      {
        type: "single",
        x: 5502,
        y: 870
      },
      {
        type: "single",
        x: 5607,
        y: 920
      },
      {
        type: "single",
        x: 7587,
        y: 318
      },
      {
        type: "single",
        x: 7725,
        y: 485
      },
      {
        type: "single",
        x: 7861,
        y: 635
      },
      {
        type: "single",
        x: 7997,
        y: 769
      },
      {
        type: "single",
        x: 8132,
        y: 887
      },
      {
        type: "single",
        x: 8265,
        y: 989
      },
      {
        type: "single",
        x: 8398,
        y: 1075
      },
      {
        type: "single",
        x: 9243,
        y: 1162
      },
      {
        type: "single",
        x: 9371,
        y: 1103
      },
      {
        type: "single",
        x: 9498,
        y: 1028
      },
      {
        type: "single",
        x: 9623,
        y: 916
      },
      {
        type: "single",
        x: 9748,
        y: 781
      },
      {
        type: "single",
        x: 9873,
        y: 632
      },
      {
        type: "single",
        x: 9996,
        y: 470
      },
      {
        type: "single",
        x: 10920,
        y: 183
      },
      {
        type: "single",
        x: 10992,
        y: 266
      },
      {
        type: "single",
        x: 11063,
        y: 346
      },
      {
        type: "single",
        x: 11134,
        y: 421
      },
      {
        type: "single",
        x: 11205,
        y: 492
      },
      {
        type: "single",
        x: 11275,
        y: 560
      },
      {
        type: "single",
        x: 11345,
        y: 623
      },
      {
        type: "single",
        x: 12170,
        y: 1013
      },
      {
        type: "single",
        x: 12305,
        y: 958
      },
      {
        type: "single",
        x: 12438,
        y: 858
      },
      {
        type: "single",
        x: 12571,
        y: 715
      },
      {
        type: "single",
        x: 12703,
        y: 534
      },
      {
        type: "single",
        x: 12779,
        y: 422
      },
      {
        type: "single",
        x: 12909,
        y: 219
      },
      {
        type: "single",
        x: 14079,
        y: 327
      },
      {
        type: "single",
        x: 14166,
        y: 407
      },
      {
        type: "single",
        x: 14253,
        y: 476
      },
      {
        type: "single",
        x: 14340,
        y: 532
      },
      {
        type: "single",
        x: 14426,
        y: 578
      },
      {
        type: "single",
        x: 14511,
        y: 612
      },
      {
        type: "single",
        x: 14597,
        y: 634
      },
      {
        type: "single",
        x: 17213,
        y: 435
      },
      {
        type: "single",
        x: 17285,
        y: 501
      },
      {
        type: "single",
        x: 17357,
        y: 562
      },
      {
        type: "single",
        x: 17429,
        y: 620
      },
      {
        type: "single",
        x: 17500,
        y: 674
      },
      {
        type: "single",
        x: 17571,
        y: 723
      },
      {
        type: "single",
        x: 17642,
        y: 769
      },
      {
        type: "single",
        x: 19974,
        y: 391
      },
      {
        type: "single",
        x: 20053,
        y: 499
      },
      {
        type: "single",
        x: 20132,
        y: 596
      },
      {
        type: "single",
        x: 20211,
        y: 681
      },
      {
        type: "single",
        x: 20289,
        y: 755
      },
      {
        type: "single",
        x: 20367,
        y: 818
      },
      {
        type: "single",
        x: 20445,
        y: 875
      },
      {
        type: "single",
        x: 21282,
        y: 1255
      },
      {
        type: "single",
        x: 21357,
        y: 1267
      },
      {
        type: "single",
        x: 21431,
        y: 1274
      },
      {
        type: "single",
        x: 21505,
        y: 1278
      },
      {
        type: "single",
        x: 21579,
        y: 1278
      },
      {
        type: "single",
        x: 21653,
        y: 1275
      },
      {
        type: "single",
        x: 21727,
        y: 1268
      },
      {
        type: "single",
        x: 22591,
        y: 783
      },
      {
        type: "single",
        x: 22662,
        y: 692
      },
      {
        type: "single",
        x: 22801,
        y: 476
      },
      {
        type: "single",
        x: 22939,
        y: 218
      },
      {
        type: "single",
        x: 24061,
        y: 380
      },
      {
        type: "single",
        x: 24174,
        y: 508
      },
      {
        type: "single",
        x: 24287,
        y: 630
      },
      {
        type: "single",
        x: 24399,
        y: 749
      },
      {
        type: "single",
        x: 24510,
        y: 862
      },
      {
        type: "single",
        x: 24621,
        y: 971
      },
      {
        type: "single",
        x: 24731,
        y: 1076
      },
      {
        type: "single",
        x: 2100,
        y: 1014
      },
      {
        type: "single",
        x: 2217,
        y: 916
      },
      {
        type: "single",
        x: 2332,
        y: 774
      },
      {
        type: "single",
        x: 2447,
        y: 588
      },
      {
        type: "single",
        x: 2561,
        y: 359
      },
      {
        type: "single",
        x: 2674,
        y: 87
      },
      {
        type: "single",
        x: 4016,
        y: 927
      },
      {
        type: "single",
        x: 4128,
        y: 1070
      },
      {
        type: "single",
        x: 4241,
        y: 1209
      },
      {
        type: "single",
        x: 4352,
        y: 1342
      },
      {
        type: "single",
        x: 4463,
        y: 1472
      },
      {
        type: "single",
        x: 4573,
        y: 1597
      },
      {
        type: "single",
        x: 4683,
        y: 1717
      },
      {
        type: "single",
        x: 6065,
        y: 2323
      },
      {
        type: "single",
        x: 6168,
        y: 2290
      },
      {
        type: "single",
        x: 6254,
        y: 2255
      },
      {
        type: "single",
        x: 6357,
        y: 2202
      },
      {
        type: "single",
        x: 6459,
        y: 2138
      },
      {
        type: "single",
        x: 6561,
        y: 2063
      },
      {
        type: "single",
        x: 6663,
        y: 1977
      },
      {
        type: "single",
        x: 10331,
        y: 1565
      },
      {
        type: "single",
        x: 10433,
        y: 1645
      },
      {
        type: "single",
        x: 10535,
        y: 1714
      },
      {
        type: "single",
        x: 10636,
        y: 1771
      },
      {
        type: "single",
        x: 10737,
        y: 1817
      },
      {
        type: "single",
        x: 10838,
        y: 1852
      },
      {
        type: "single",
        x: 10939,
        y: 1877
      },
      {
        type: "single",
        x: 15256,
        y: 257
      },
      {
        type: "single",
        x: 15361,
        y: 388
      },
      {
        type: "single",
        x: 15466,
        y: 503
      },
      {
        type: "single",
        x: 15570,
        y: 603
      },
      {
        type: "single",
        x: 15674,
        y: 687
      },
      {
        type: "single",
        x: 15777,
        y: 756
      },
      {
        type: "single",
        x: 15880,
        y: 810
      },
      {
        type: "single",
        x: 20732,
        y: 979
      },
      {
        type: "single",
        x: 20834,
        y: 998
      },
      {
        type: "single",
        x: 20935,
        y: 1002
      },
      {
        type: "single",
        x: 21036,
        y: 984
      },
      {
        type: "single",
        x: 21137,
        y: 921
      },
      {
        type: "single",
        x: 21237,
        y: 815
      },
      {
        type: "single",
        x: 21337,
        y: 668
      },
      {
        type: "single",
        x: 23251,
        y: 1052
      },
      {
        type: "single",
        x: 23332,
        y: 1134
      },
      {
        type: "single",
        x: 23412,
        y: 1212
      },
      {
        type: "single",
        x: 23492,
        y: 1286
      },
      {
        type: "single",
        x: 23572,
        y: 1356
      },
      {
        type: "single",
        x: 23652,
        y: 1422
      },
      {
        type: "single",
        x: 23731,
        y: 1484
      },
      {
        type: "ground",
        x: 3738,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 11610,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 12870,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 14204,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 20122,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 22836,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "arc",
        x: 9624,
        y: 956,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 5070,
        y: 888,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      }
    ],
    blizzard: {
      startGap: 1200,
      speed: 640,
      accel: 6
    },
    expect: {
      upgrades: {
        flap: 1
      }
    },
    goals: [
      {
        type: "gold",
        n: 1
      },
      {
        type: "height",
        n: 60
      }
    ],
    ice: [],
    wind: [],
    geysers: [],
    rings: [],
    decor: [
      {
        type: "sign",
        x: 340
      },
      {
        type: "pine",
        x: 700,
        s: 0.95,
        v: 2
      },
      {
        type: "rock",
        x: 1219,
        s: 0.87,
        v: 1
      },
      {
        type: "pine",
        x: 1701,
        s: 0.86,
        v: 1
      },
      {
        type: "pine",
        x: 2327,
        s: 0.76,
        v: 2
      },
      {
        type: "rock",
        x: 2877,
        s: 0.91,
        v: 0
      },
      {
        type: "pine",
        x: 3288,
        s: 0.78,
        v: 0
      },
      {
        type: "pine",
        x: 3777,
        s: 0.97,
        v: 1
      },
      {
        type: "pine",
        x: 4357,
        s: 1.09,
        v: 1
      },
      {
        type: "pine",
        x: 4995,
        s: 1.05,
        v: 2
      },
      {
        type: "pine",
        x: 5641,
        s: 0.77,
        v: 1
      },
      {
        type: "pine",
        x: 6257,
        s: 0.78,
        v: 1
      },
      {
        type: "rock",
        x: 7015,
        s: 1.08,
        v: 1
      },
      {
        type: "pine",
        x: 7652,
        s: 0.79,
        v: 1
      },
      {
        type: "pine",
        x: 8300,
        s: 1.06,
        v: 2
      },
      {
        type: "rock",
        x: 9041,
        s: 1.09,
        v: 0
      },
      {
        type: "pine",
        x: 9701,
        s: 0.9,
        v: 0
      },
      {
        type: "pine",
        x: 10338,
        s: 0.83,
        v: 2
      },
      {
        type: "pine",
        x: 10828,
        s: 1.07,
        v: 1
      },
      {
        type: "pine",
        x: 11481,
        s: 1.1,
        v: 0
      },
      {
        type: "rock",
        x: 11926,
        s: 1,
        v: 2
      },
      {
        type: "pine",
        x: 12502,
        s: 0.87,
        v: 2
      },
      {
        type: "pine",
        x: 13047,
        s: 0.86,
        v: 1
      },
      {
        type: "rock",
        x: 13478,
        s: 0.76,
        v: 2
      },
      {
        type: "rock",
        x: 13902,
        s: 1.04,
        v: 2
      },
      {
        type: "pine",
        x: 14453,
        s: 0.79,
        v: 1
      },
      {
        type: "pine",
        x: 15084,
        s: 0.96,
        v: 2
      },
      {
        type: "rock",
        x: 15785,
        s: 1.08,
        v: 2
      },
      {
        type: "rock",
        x: 16515,
        s: 0.84,
        v: 2
      },
      {
        type: "pine",
        x: 17037,
        s: 0.89,
        v: 1
      },
      {
        type: "rock",
        x: 17627,
        s: 0.93,
        v: 0
      },
      {
        type: "rock",
        x: 18125,
        s: 0.75,
        v: 2
      },
      {
        type: "pine",
        x: 18770,
        s: 0.82,
        v: 0
      },
      {
        type: "rock",
        x: 19433,
        s: 1.09,
        v: 0
      },
      {
        type: "pine",
        x: 19966,
        s: 0.81,
        v: 0
      },
      {
        type: "rock",
        x: 20364,
        s: 1,
        v: 2
      },
      {
        type: "pine",
        x: 21022,
        s: 1.04,
        v: 0
      },
      {
        type: "rock",
        x: 21650,
        s: 1,
        v: 1
      },
      {
        type: "pine",
        x: 22201,
        s: 1.01,
        v: 1
      },
      {
        type: "pine",
        x: 22687,
        s: 0.92,
        v: 1
      },
      {
        type: "pine",
        x: 23290,
        s: 1.02,
        v: 0
      },
      {
        type: "rock",
        x: 23707,
        s: 0.95,
        v: 0
      },
      {
        type: "pine",
        x: 24134,
        s: 0.75,
        v: 0
      },
      {
        type: "rock",
        x: 24603,
        s: 0.8,
        v: 2
      },
      {
        type: "snowman",
        x: 11464,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 25436
      }
    ]
  };

  // src/data/levels/island03.json
  var island03_default = {
    id: "island03",
    name: {
      ko: "\uC5BC\uC74C \uD638\uC218",
      en: "Glass Lake"
    },
    biome: "lake",
    surface: "snow",
    intro: "ice",
    points: [
      [
        0,
        520
      ],
      [
        673,
        -272
      ],
      [
        1341,
        248
      ],
      [
        1957,
        -279
      ],
      [
        2551,
        226
      ],
      [
        3148,
        -263
      ],
      [
        3739,
        223
      ],
      [
        5089,
        -507
      ],
      [
        6530,
        423
      ],
      [
        7112,
        -283
      ],
      [
        7683,
        211
      ],
      [
        8302,
        -297
      ],
      [
        8966,
        216
      ],
      [
        9572,
        -255
      ],
      [
        10172,
        214
      ],
      [
        10475,
        -104
      ],
      [
        10787,
        68
      ],
      [
        11130,
        -122
      ],
      [
        11465,
        107
      ],
      [
        12124,
        -277
      ],
      [
        12824,
        332
      ],
      [
        13475,
        -282
      ],
      [
        14164,
        284
      ],
      [
        14870,
        -267
      ],
      [
        15608,
        339
      ],
      [
        17003,
        -407
      ],
      [
        18351,
        482
      ],
      [
        18995,
        -211
      ],
      [
        19648,
        301
      ],
      [
        20319,
        -171
      ],
      [
        21042,
        327
      ],
      [
        21637,
        -145
      ],
      [
        22232,
        360
      ],
      [
        23118,
        -304
      ],
      [
        24037,
        495
      ],
      [
        24684,
        -204
      ],
      [
        25379,
        324
      ],
      [
        26014,
        -178
      ],
      [
        26607,
        271
      ],
      [
        27247,
        -153
      ],
      [
        27932,
        288
      ],
      [
        28572,
        -200
      ],
      [
        29392,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 1307,
        y: 369
      },
      {
        type: "single",
        x: 1415,
        y: 485
      },
      {
        type: "single",
        x: 1522,
        y: 585
      },
      {
        type: "single",
        x: 1629,
        y: 669
      },
      {
        type: "single",
        x: 1735,
        y: 738
      },
      {
        type: "single",
        x: 1841,
        y: 792
      },
      {
        type: "single",
        x: 1946,
        y: 831
      },
      {
        type: "single",
        x: 3708,
        y: 368
      },
      {
        type: "single",
        x: 3790,
        y: 482
      },
      {
        type: "single",
        x: 3871,
        y: 592
      },
      {
        type: "single",
        x: 3951,
        y: 697
      },
      {
        type: "single",
        x: 4032,
        y: 799
      },
      {
        type: "single",
        x: 4111,
        y: 895
      },
      {
        type: "single",
        x: 4191,
        y: 988
      },
      {
        type: "single",
        x: 5105,
        y: 1775
      },
      {
        type: "single",
        x: 5180,
        y: 1816
      },
      {
        type: "single",
        x: 5255,
        y: 1853
      },
      {
        type: "single",
        x: 5330,
        y: 1886
      },
      {
        type: "single",
        x: 5405,
        y: 1909
      },
      {
        type: "single",
        x: 5479,
        y: 1921
      },
      {
        type: "single",
        x: 5553,
        y: 1922
      },
      {
        type: "single",
        x: 6424,
        y: 1223
      },
      {
        type: "single",
        x: 6494,
        y: 1097
      },
      {
        type: "single",
        x: 6564,
        y: 961
      },
      {
        type: "single",
        x: 6703,
        y: 657
      },
      {
        type: "single",
        x: 6839,
        y: 313
      },
      {
        type: "single",
        x: 6974,
        y: -61
      },
      {
        type: "single",
        x: 7834,
        y: 632
      },
      {
        type: "single",
        x: 7926,
        y: 766
      },
      {
        type: "single",
        x: 8018,
        y: 894
      },
      {
        type: "single",
        x: 8110,
        y: 1019
      },
      {
        type: "single",
        x: 8201,
        y: 1138
      },
      {
        type: "single",
        x: 8292,
        y: 1253
      },
      {
        type: "single",
        x: 8382,
        y: 1364
      },
      {
        type: "single",
        x: 9257,
        y: 2019
      },
      {
        type: "single",
        x: 9343,
        y: 2036
      },
      {
        type: "single",
        x: 9428,
        y: 2045
      },
      {
        type: "single",
        x: 9513,
        y: 2042
      },
      {
        type: "single",
        x: 9598,
        y: 2032
      },
      {
        type: "single",
        x: 9683,
        y: 2018
      },
      {
        type: "single",
        x: 9767,
        y: 2e3
      },
      {
        type: "single",
        x: 10674,
        y: 1529
      },
      {
        type: "single",
        x: 10754,
        y: 1441
      },
      {
        type: "single",
        x: 10834,
        y: 1345
      },
      {
        type: "single",
        x: 10914,
        y: 1245
      },
      {
        type: "single",
        x: 10993,
        y: 1143
      },
      {
        type: "single",
        x: 11072,
        y: 1037
      },
      {
        type: "single",
        x: 11150,
        y: 927
      },
      {
        type: "single",
        x: 12820,
        y: 565
      },
      {
        type: "single",
        x: 12912,
        y: 702
      },
      {
        type: "single",
        x: 13005,
        y: 836
      },
      {
        type: "single",
        x: 13096,
        y: 964
      },
      {
        type: "single",
        x: 13187,
        y: 1089
      },
      {
        type: "single",
        x: 13278,
        y: 1208
      },
      {
        type: "single",
        x: 13368,
        y: 1323
      },
      {
        type: "single",
        x: 14243,
        y: 2e3
      },
      {
        type: "single",
        x: 14329,
        y: 2015
      },
      {
        type: "single",
        x: 14414,
        y: 2019
      },
      {
        type: "single",
        x: 14500,
        y: 2012
      },
      {
        type: "single",
        x: 14584,
        y: 1994
      },
      {
        type: "single",
        x: 14669,
        y: 1964
      },
      {
        type: "single",
        x: 14753,
        y: 1923
      },
      {
        type: "single",
        x: 15655,
        y: 1036
      },
      {
        type: "single",
        x: 15734,
        y: 934
      },
      {
        type: "single",
        x: 15813,
        y: 828
      },
      {
        type: "single",
        x: 15892,
        y: 719
      },
      {
        type: "single",
        x: 15970,
        y: 607
      },
      {
        type: "single",
        x: 16048,
        y: 492
      },
      {
        type: "single",
        x: 16126,
        y: 374
      },
      {
        type: "single",
        x: 18171,
        y: 599
      },
      {
        type: "single",
        x: 18263,
        y: 690
      },
      {
        type: "single",
        x: 18353,
        y: 769
      },
      {
        type: "single",
        x: 18444,
        y: 836
      },
      {
        type: "single",
        x: 18534,
        y: 892
      },
      {
        type: "single",
        x: 18623,
        y: 937
      },
      {
        type: "single",
        x: 18713,
        y: 970
      },
      {
        type: "single",
        x: 19588,
        y: 1041
      },
      {
        type: "single",
        x: 19674,
        y: 1028
      },
      {
        type: "single",
        x: 19760,
        y: 1011
      },
      {
        type: "single",
        x: 19845,
        y: 990
      },
      {
        type: "single",
        x: 19930,
        y: 965
      },
      {
        type: "single",
        x: 20015,
        y: 937
      },
      {
        type: "single",
        x: 20099,
        y: 905
      },
      {
        type: "single",
        x: 22263,
        y: 524
      },
      {
        type: "single",
        x: 22371,
        y: 615
      },
      {
        type: "single",
        x: 22478,
        y: 691
      },
      {
        type: "single",
        x: 22585,
        y: 752
      },
      {
        type: "single",
        x: 22691,
        y: 798
      },
      {
        type: "single",
        x: 22797,
        y: 828
      },
      {
        type: "single",
        x: 22902,
        y: 843
      },
      {
        type: "single",
        x: 25314,
        y: 435
      },
      {
        type: "single",
        x: 25385,
        y: 524
      },
      {
        type: "single",
        x: 25456,
        y: 609
      },
      {
        type: "single",
        x: 25527,
        y: 689
      },
      {
        type: "single",
        x: 25598,
        y: 759
      },
      {
        type: "single",
        x: 25668,
        y: 818
      },
      {
        type: "single",
        x: 25738,
        y: 865
      },
      {
        type: "single",
        x: 27898,
        y: 424
      },
      {
        type: "single",
        x: 27980,
        y: 512
      },
      {
        type: "single",
        x: 28062,
        y: 596
      },
      {
        type: "single",
        x: 28143,
        y: 675
      },
      {
        type: "single",
        x: 28223,
        y: 750
      },
      {
        type: "single",
        x: 28303,
        y: 822
      },
      {
        type: "single",
        x: 28383,
        y: 889
      },
      {
        type: "single",
        x: 2491,
        y: 304
      },
      {
        type: "single",
        x: 2577,
        y: 407
      },
      {
        type: "single",
        x: 2662,
        y: 496
      },
      {
        type: "single",
        x: 2747,
        y: 569
      },
      {
        type: "single",
        x: 2832,
        y: 627
      },
      {
        type: "single",
        x: 2916,
        y: 670
      },
      {
        type: "single",
        x: 3e3,
        y: 697
      },
      {
        type: "single",
        x: 8712,
        y: 1749
      },
      {
        type: "single",
        x: 8789,
        y: 1807
      },
      {
        type: "single",
        x: 8866,
        y: 1862
      },
      {
        type: "single",
        x: 8942,
        y: 1913
      },
      {
        type: "single",
        x: 9018,
        y: 1960
      },
      {
        type: "single",
        x: 9094,
        y: 2003
      },
      {
        type: "single",
        x: 9170,
        y: 2042
      },
      {
        type: "single",
        x: 13691,
        y: 1814
      },
      {
        type: "single",
        x: 13773,
        y: 1907
      },
      {
        type: "single",
        x: 13855,
        y: 1991
      },
      {
        type: "single",
        x: 13937,
        y: 2064
      },
      {
        type: "single",
        x: 14018,
        y: 2126
      },
      {
        type: "single",
        x: 14099,
        y: 2176
      },
      {
        type: "single",
        x: 14180,
        y: 2214
      },
      {
        type: "single",
        x: 19022,
        y: 1564
      },
      {
        type: "single",
        x: 19119,
        y: 1632
      },
      {
        type: "single",
        x: 19216,
        y: 1687
      },
      {
        type: "single",
        x: 19312,
        y: 1732
      },
      {
        type: "single",
        x: 19408,
        y: 1765
      },
      {
        type: "single",
        x: 19504,
        y: 1788
      },
      {
        type: "single",
        x: 19599,
        y: 1807
      },
      {
        type: "single",
        x: 20994,
        y: 1452
      },
      {
        type: "single",
        x: 21085,
        y: 1386
      },
      {
        type: "single",
        x: 21175,
        y: 1316
      },
      {
        type: "single",
        x: 21264,
        y: 1244
      },
      {
        type: "single",
        x: 21354,
        y: 1169
      },
      {
        type: "single",
        x: 21443,
        y: 1091
      },
      {
        type: "single",
        x: 21532,
        y: 1010
      },
      {
        type: "single",
        x: 23867,
        y: 515
      },
      {
        type: "single",
        x: 23975,
        y: 663
      },
      {
        type: "single",
        x: 24082,
        y: 796
      },
      {
        type: "single",
        x: 24189,
        y: 912
      },
      {
        type: "single",
        x: 24295,
        y: 1013
      },
      {
        type: "single",
        x: 24401,
        y: 1099
      },
      {
        type: "single",
        x: 24506,
        y: 1169
      },
      {
        type: "single",
        x: 26528,
        y: 374
      },
      {
        type: "single",
        x: 26632,
        y: 528
      },
      {
        type: "single",
        x: 26734,
        y: 677
      },
      {
        type: "single",
        x: 26836,
        y: 823
      },
      {
        type: "single",
        x: 26938,
        y: 963
      },
      {
        type: "single",
        x: 27038,
        y: 1099
      },
      {
        type: "single",
        x: 27139,
        y: 1230
      },
      {
        type: "ground",
        x: 120,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 9086,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 11585,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 21162,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 24157,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 26727,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "arc",
        x: 15688,
        y: 1039,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 24117,
        y: 1195,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      }
    ],
    blizzard: {
      startGap: 1200,
      speed: 620,
      accel: 6
    },
    expect: {
      upgrades: {
        flap: 2,
        slide: 1,
        magnet: 1
      }
    },
    goals: [
      {
        type: "fever",
        n: 1
      },
      {
        type: "fish",
        n: 80
      }
    ],
    ice: [
      [
        1401,
        1997
      ],
      [
        2611,
        3188
      ],
      [
        6590,
        7152
      ],
      [
        11525,
        12164
      ],
      [
        12884,
        13515
      ],
      [
        21102,
        21677
      ],
      [
        24097,
        24724
      ],
      [
        25439,
        26054
      ],
      [
        26667,
        27287
      ]
    ],
    wind: [],
    geysers: [],
    rings: [],
    decor: [
      {
        type: "sign",
        x: 340
      },
      {
        type: "crystal",
        x: 700,
        s: 1.02,
        v: 1
      },
      {
        type: "rock",
        x: 1317,
        s: 0.9,
        v: 1
      },
      {
        type: "crystal",
        x: 1862,
        s: 1.02,
        v: 0
      },
      {
        type: "crystal",
        x: 2413,
        s: 0.99,
        v: 2
      },
      {
        type: "crystal",
        x: 3089,
        s: 0.89,
        v: 0
      },
      {
        type: "rock",
        x: 3491,
        s: 0.8,
        v: 1
      },
      {
        type: "crystal",
        x: 4162,
        s: 1.06,
        v: 1
      },
      {
        type: "crystal",
        x: 4862,
        s: 0.75,
        v: 2
      },
      {
        type: "crystal",
        x: 5496,
        s: 1.06,
        v: 2
      },
      {
        type: "rock",
        x: 6098,
        s: 0.78,
        v: 0
      },
      {
        type: "rock",
        x: 6818,
        s: 1.1,
        v: 2
      },
      {
        type: "crystal",
        x: 7497,
        s: 0.88,
        v: 2
      },
      {
        type: "rock",
        x: 8025,
        s: 0.97,
        v: 2
      },
      {
        type: "rock",
        x: 8732,
        s: 1.09,
        v: 2
      },
      {
        type: "rock",
        x: 9183,
        s: 0.95,
        v: 2
      },
      {
        type: "crystal",
        x: 9940,
        s: 0.82,
        v: 0
      },
      {
        type: "rock",
        x: 10596,
        s: 1.08,
        v: 2
      },
      {
        type: "crystal",
        x: 11179,
        s: 0.84,
        v: 1
      },
      {
        type: "rock",
        x: 11809,
        s: 0.81,
        v: 2
      },
      {
        type: "crystal",
        x: 12356,
        s: 1.1,
        v: 2
      },
      {
        type: "crystal",
        x: 13083,
        s: 0.77,
        v: 2
      },
      {
        type: "rock",
        x: 13603,
        s: 0.83,
        v: 1
      },
      {
        type: "rock",
        x: 14148,
        s: 0.75,
        v: 2
      },
      {
        type: "crystal",
        x: 14880,
        s: 1.07,
        v: 1
      },
      {
        type: "rock",
        x: 15276,
        s: 0.81,
        v: 2
      },
      {
        type: "crystal",
        x: 16001,
        s: 0.79,
        v: 0
      },
      {
        type: "rock",
        x: 16494,
        s: 0.93,
        v: 2
      },
      {
        type: "crystal",
        x: 17124,
        s: 0.94,
        v: 0
      },
      {
        type: "rock",
        x: 17640,
        s: 0.76,
        v: 1
      },
      {
        type: "rock",
        x: 18212,
        s: 0.79,
        v: 0
      },
      {
        type: "crystal",
        x: 18966,
        s: 0.85,
        v: 2
      },
      {
        type: "rock",
        x: 19348,
        s: 0.96,
        v: 0
      },
      {
        type: "crystal",
        x: 19810,
        s: 0.99,
        v: 2
      },
      {
        type: "rock",
        x: 20344,
        s: 1.03,
        v: 2
      },
      {
        type: "rock",
        x: 20928,
        s: 0.95,
        v: 2
      },
      {
        type: "crystal",
        x: 21622,
        s: 0.81,
        v: 1
      },
      {
        type: "rock",
        x: 22249,
        s: 0.97,
        v: 0
      },
      {
        type: "crystal",
        x: 22671,
        s: 1.07,
        v: 1
      },
      {
        type: "crystal",
        x: 23389,
        s: 0.92,
        v: 1
      },
      {
        type: "rock",
        x: 23861,
        s: 0.95,
        v: 0
      },
      {
        type: "crystal",
        x: 24310,
        s: 0.92,
        v: 0
      },
      {
        type: "rock",
        x: 24947,
        s: 1.09,
        v: 2
      },
      {
        type: "crystal",
        x: 25616,
        s: 0.81,
        v: 1
      },
      {
        type: "crystal",
        x: 26075,
        s: 0.89,
        v: 1
      },
      {
        type: "rock",
        x: 26578,
        s: 0.82,
        v: 0
      },
      {
        type: "rock",
        x: 27119,
        s: 0.86,
        v: 2
      },
      {
        type: "rock",
        x: 27624,
        s: 0.8,
        v: 2
      },
      {
        type: "crystal",
        x: 28032,
        s: 0.78,
        v: 0
      },
      {
        type: "crystal",
        x: 28464,
        s: 0.77,
        v: 2
      },
      {
        type: "snowman",
        x: 13226,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 29352
      }
    ]
  };

  // src/data/levels/island04.json
  var island04_default = {
    id: "island04",
    name: {
      ko: "\uBC14\uB78C \uACC4\uACE1",
      en: "Windy Valley"
    },
    biome: "wind",
    surface: "snow",
    intro: "wind",
    points: [
      [
        0,
        520
      ],
      [
        615,
        -293
      ],
      [
        1186,
        237
      ],
      [
        1815,
        -261
      ],
      [
        2421,
        241
      ],
      [
        3027,
        -208
      ],
      [
        3574,
        261
      ],
      [
        4280,
        -272
      ],
      [
        5012,
        316
      ],
      [
        5711,
        -273
      ],
      [
        6433,
        340
      ],
      [
        7103,
        -263
      ],
      [
        7744,
        343
      ],
      [
        8060,
        -27
      ],
      [
        8388,
        171
      ],
      [
        8695,
        -57
      ],
      [
        8993,
        161
      ],
      [
        9332,
        -20
      ],
      [
        9688,
        158
      ],
      [
        10301,
        -184
      ],
      [
        10900,
        354
      ],
      [
        11519,
        -138
      ],
      [
        12159,
        378
      ],
      [
        12803,
        -112
      ],
      [
        13486,
        346
      ],
      [
        14424,
        -268
      ],
      [
        15280,
        508
      ],
      [
        16183,
        -264
      ],
      [
        17065,
        504
      ],
      [
        17728,
        -180
      ],
      [
        18427,
        420
      ],
      [
        19130,
        -200
      ],
      [
        19831,
        440
      ],
      [
        20483,
        -171
      ],
      [
        21183,
        390
      ],
      [
        21809,
        -104
      ],
      [
        22390,
        344
      ],
      [
        22980,
        -137
      ],
      [
        23607,
        359
      ],
      [
        24195,
        -102
      ],
      [
        24780,
        342
      ],
      [
        25420,
        -200
      ],
      [
        26240,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 1342,
        y: 623
      },
      {
        type: "single",
        x: 1441,
        y: 735
      },
      {
        type: "single",
        x: 1541,
        y: 831
      },
      {
        type: "single",
        x: 1639,
        y: 912
      },
      {
        type: "single",
        x: 1738,
        y: 985
      },
      {
        type: "single",
        x: 1836,
        y: 1069
      },
      {
        type: "single",
        x: 1933,
        y: 1163
      },
      {
        type: "single",
        x: 2837,
        y: 1551
      },
      {
        type: "single",
        x: 2931,
        y: 1516
      },
      {
        type: "single",
        x: 3024,
        y: 1468
      },
      {
        type: "single",
        x: 3116,
        y: 1407
      },
      {
        type: "single",
        x: 3209,
        y: 1333
      },
      {
        type: "single",
        x: 3301,
        y: 1246
      },
      {
        type: "single",
        x: 3392,
        y: 1145
      },
      {
        type: "single",
        x: 5e3,
        y: 441
      },
      {
        type: "single",
        x: 5100,
        y: 514
      },
      {
        type: "single",
        x: 5200,
        y: 572
      },
      {
        type: "single",
        x: 5300,
        y: 615
      },
      {
        type: "single",
        x: 5399,
        y: 643
      },
      {
        type: "single",
        x: 5498,
        y: 656
      },
      {
        type: "single",
        x: 5597,
        y: 654
      },
      {
        type: "single",
        x: 7709,
        y: 491
      },
      {
        type: "single",
        x: 7809,
        y: 629
      },
      {
        type: "single",
        x: 7908,
        y: 751
      },
      {
        type: "single",
        x: 8007,
        y: 857
      },
      {
        type: "single",
        x: 8106,
        y: 948
      },
      {
        type: "single",
        x: 8204,
        y: 1024
      },
      {
        type: "single",
        x: 8301,
        y: 1084
      },
      {
        type: "single",
        x: 9210,
        y: 934
      },
      {
        type: "single",
        x: 9303,
        y: 847
      },
      {
        type: "single",
        x: 9397,
        y: 747
      },
      {
        type: "single",
        x: 9489,
        y: 634
      },
      {
        type: "single",
        x: 9582,
        y: 509
      },
      {
        type: "single",
        x: 9673,
        y: 370
      },
      {
        type: "single",
        x: 10884,
        y: 524
      },
      {
        type: "single",
        x: 10991,
        y: 669
      },
      {
        type: "single",
        x: 11097,
        y: 798
      },
      {
        type: "single",
        x: 11203,
        y: 911
      },
      {
        type: "single",
        x: 11308,
        y: 1009
      },
      {
        type: "single",
        x: 11412,
        y: 1091
      },
      {
        type: "single",
        x: 11516,
        y: 1158
      },
      {
        type: "single",
        x: 13440,
        y: 483
      },
      {
        type: "single",
        x: 13515,
        y: 571
      },
      {
        type: "single",
        x: 13589,
        y: 654
      },
      {
        type: "single",
        x: 13664,
        y: 733
      },
      {
        type: "single",
        x: 13737,
        y: 808
      },
      {
        type: "single",
        x: 13811,
        y: 879
      },
      {
        type: "single",
        x: 13885,
        y: 945
      },
      {
        type: "single",
        x: 14818,
        y: 1241
      },
      {
        type: "single",
        x: 14888,
        y: 1193
      },
      {
        type: "single",
        x: 14959,
        y: 1134
      },
      {
        type: "single",
        x: 15098,
        y: 986
      },
      {
        type: "single",
        x: 15237,
        y: 821
      },
      {
        type: "single",
        x: 15374,
        y: 643
      },
      {
        type: "single",
        x: 16947,
        y: 646
      },
      {
        type: "single",
        x: 17041,
        y: 794
      },
      {
        type: "single",
        x: 17134,
        y: 938
      },
      {
        type: "single",
        x: 17227,
        y: 1077
      },
      {
        type: "single",
        x: 17319,
        y: 1212
      },
      {
        type: "single",
        x: 17411,
        y: 1342
      },
      {
        type: "single",
        x: 17502,
        y: 1465
      },
      {
        type: "single",
        x: 18477,
        y: 2260
      },
      {
        type: "single",
        x: 18564,
        y: 2288
      },
      {
        type: "single",
        x: 18650,
        y: 2312
      },
      {
        type: "single",
        x: 18736,
        y: 2333
      },
      {
        type: "single",
        x: 18822,
        y: 2349
      },
      {
        type: "single",
        x: 18907,
        y: 2362
      },
      {
        type: "single",
        x: 18993,
        y: 2371
      },
      {
        type: "single",
        x: 19914,
        y: 2237
      },
      {
        type: "single",
        x: 19996,
        y: 2205
      },
      {
        type: "single",
        x: 20078,
        y: 2170
      },
      {
        type: "single",
        x: 20159,
        y: 2131
      },
      {
        type: "single",
        x: 20241,
        y: 2089
      },
      {
        type: "single",
        x: 20322,
        y: 2038
      },
      {
        type: "single",
        x: 20403,
        y: 1975
      },
      {
        type: "single",
        x: 21345,
        y: 681
      },
      {
        type: "single",
        x: 21421,
        y: 513
      },
      {
        type: "single",
        x: 21497,
        y: 341
      },
      {
        type: "single",
        x: 21571,
        y: 166
      },
      {
        type: "single",
        x: 22573,
        y: 816
      },
      {
        type: "single",
        x: 22683,
        y: 970
      },
      {
        type: "single",
        x: 22793,
        y: 1120
      },
      {
        type: "single",
        x: 22902,
        y: 1230
      },
      {
        type: "single",
        x: 23010,
        y: 1305
      },
      {
        type: "single",
        x: 23118,
        y: 1379
      },
      {
        type: "single",
        x: 23226,
        y: 1453
      },
      {
        type: "single",
        x: 24172,
        y: 1941
      },
      {
        type: "single",
        x: 24275,
        y: 1975
      },
      {
        type: "single",
        x: 24377,
        y: 2006
      },
      {
        type: "single",
        x: 24480,
        y: 2033
      },
      {
        type: "single",
        x: 24581,
        y: 2055
      },
      {
        type: "single",
        x: 24683,
        y: 2074
      },
      {
        type: "single",
        x: 24784,
        y: 2090
      },
      {
        type: "single",
        x: 2322,
        y: 946
      },
      {
        type: "single",
        x: 2452,
        y: 866
      },
      {
        type: "single",
        x: 2581,
        y: 774
      },
      {
        type: "single",
        x: 2709,
        y: 671
      },
      {
        type: "single",
        x: 2837,
        y: 557
      },
      {
        type: "single",
        x: 2964,
        y: 432
      },
      {
        type: "single",
        x: 3090,
        y: 296
      },
      {
        type: "single",
        x: 5911,
        y: 1237
      },
      {
        type: "single",
        x: 6021,
        y: 1212
      },
      {
        type: "single",
        x: 6131,
        y: 1142
      },
      {
        type: "single",
        x: 6240,
        y: 1036
      },
      {
        type: "single",
        x: 6349,
        y: 919
      },
      {
        type: "single",
        x: 6458,
        y: 785
      },
      {
        type: "single",
        x: 6565,
        y: 610
      },
      {
        type: "single",
        x: 8603,
        y: 1893
      },
      {
        type: "single",
        x: 8698,
        y: 2002
      },
      {
        type: "single",
        x: 8792,
        y: 2106
      },
      {
        type: "single",
        x: 8885,
        y: 2206
      },
      {
        type: "single",
        x: 8979,
        y: 2302
      },
      {
        type: "single",
        x: 9071,
        y: 2394
      },
      {
        type: "single",
        x: 9164,
        y: 2481
      },
      {
        type: "single",
        x: 11800,
        y: 1985
      },
      {
        type: "single",
        x: 11883,
        y: 1823
      },
      {
        type: "single",
        x: 11965,
        y: 1650
      },
      {
        type: "single",
        x: 12047,
        y: 1467
      },
      {
        type: "single",
        x: 12129,
        y: 1274
      },
      {
        type: "single",
        x: 12209,
        y: 1071
      },
      {
        type: "single",
        x: 12290,
        y: 858
      },
      {
        type: "single",
        x: 14226,
        y: 1589
      },
      {
        type: "single",
        x: 14355,
        y: 1746
      },
      {
        type: "single",
        x: 14484,
        y: 1891
      },
      {
        type: "single",
        x: 14611,
        y: 2024
      },
      {
        type: "single",
        x: 14738,
        y: 2145
      },
      {
        type: "single",
        x: 14864,
        y: 2254
      },
      {
        type: "single",
        x: 14990,
        y: 2351
      },
      {
        type: "single",
        x: 16457,
        y: 2788
      },
      {
        type: "single",
        x: 16576,
        y: 2753
      },
      {
        type: "single",
        x: 16695,
        y: 2707
      },
      {
        type: "single",
        x: 16813,
        y: 2651
      },
      {
        type: "single",
        x: 16931,
        y: 2583
      },
      {
        type: "single",
        x: 17048,
        y: 2510
      },
      {
        type: "single",
        x: 17164,
        y: 2434
      },
      {
        type: "single",
        x: 20769,
        y: 2332
      },
      {
        type: "single",
        x: 20877,
        y: 2494
      },
      {
        type: "single",
        x: 20983,
        y: 2652
      },
      {
        type: "single",
        x: 21090,
        y: 2804
      },
      {
        type: "single",
        x: 21195,
        y: 2953
      },
      {
        type: "single",
        x: 21300,
        y: 3096
      },
      {
        type: "single",
        x: 21404,
        y: 3235
      },
      {
        type: "single",
        x: 23490,
        y: 5171
      },
      {
        type: "single",
        x: 23585,
        y: 5219
      },
      {
        type: "single",
        x: 23680,
        y: 5262
      },
      {
        type: "single",
        x: 23775,
        y: 5302
      },
      {
        type: "single",
        x: 23869,
        y: 5338
      },
      {
        type: "single",
        x: 23963,
        y: 5370
      },
      {
        type: "single",
        x: 24057,
        y: 5398
      },
      {
        type: "ground",
        x: 3694,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 6553,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 11020,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "arc",
        x: 19911,
        y: 1240,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 15360,
        y: 1308,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      }
    ],
    blizzard: {
      startGap: 1250,
      speed: 760,
      accel: 7
    },
    expect: {
      upgrades: {
        flap: 3,
        slide: 2,
        magnet: 1,
        glide: 1
      }
    },
    goals: [
      {
        type: "height",
        n: 120
      },
      {
        type: "perfect",
        n: 6
      }
    ],
    ice: [],
    wind: [
      {
        x: 1655,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 6943,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 12643,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 14264,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 16023,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 17568,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 18970,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 21649,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 22820,
        w: 320,
        h: 1500,
        power: 1
      }
    ],
    geysers: [],
    rings: [],
    decor: [
      {
        type: "sign",
        x: 340
      },
      {
        type: "rock",
        x: 700,
        s: 0.79,
        v: 0
      },
      {
        type: "pine",
        x: 1084,
        s: 1.05,
        v: 1
      },
      {
        type: "pine",
        x: 1820,
        s: 0.84,
        v: 1
      },
      {
        type: "rock",
        x: 2503,
        s: 1.02,
        v: 0
      },
      {
        type: "pine",
        x: 2889,
        s: 0.9,
        v: 1
      },
      {
        type: "rock",
        x: 3353,
        s: 1.04,
        v: 2
      },
      {
        type: "spire",
        x: 3988,
        s: 0.96,
        v: 2
      },
      {
        type: "spire",
        x: 4557,
        s: 0.91,
        v: 2
      },
      {
        type: "rock",
        x: 5197,
        s: 1.03,
        v: 0
      },
      {
        type: "rock",
        x: 5931,
        s: 0.99,
        v: 1
      },
      {
        type: "spire",
        x: 6490,
        s: 0.98,
        v: 1
      },
      {
        type: "pine",
        x: 7107,
        s: 0.8,
        v: 0
      },
      {
        type: "pine",
        x: 7709,
        s: 1.1,
        v: 2
      },
      {
        type: "rock",
        x: 8425,
        s: 1.09,
        v: 2
      },
      {
        type: "rock",
        x: 8944,
        s: 0.88,
        v: 0
      },
      {
        type: "rock",
        x: 9671,
        s: 0.98,
        v: 2
      },
      {
        type: "pine",
        x: 10360,
        s: 0.88,
        v: 2
      },
      {
        type: "pine",
        x: 10969,
        s: 1.07,
        v: 2
      },
      {
        type: "pine",
        x: 11518,
        s: 0.95,
        v: 1
      },
      {
        type: "spire",
        x: 12083,
        s: 0.85,
        v: 1
      },
      {
        type: "pine",
        x: 12790,
        s: 1.04,
        v: 1
      },
      {
        type: "rock",
        x: 13511,
        s: 0.95,
        v: 2
      },
      {
        type: "spire",
        x: 14109,
        s: 1.07,
        v: 1
      },
      {
        type: "spire",
        x: 14617,
        s: 0.91,
        v: 0
      },
      {
        type: "spire",
        x: 15349,
        s: 1.09,
        v: 1
      },
      {
        type: "rock",
        x: 15864,
        s: 1.03,
        v: 0
      },
      {
        type: "pine",
        x: 16389,
        s: 0.78,
        v: 2
      },
      {
        type: "spire",
        x: 16816,
        s: 0.88,
        v: 1
      },
      {
        type: "rock",
        x: 17249,
        s: 1.01,
        v: 1
      },
      {
        type: "spire",
        x: 17827,
        s: 0.82,
        v: 1
      },
      {
        type: "pine",
        x: 18508,
        s: 1.02,
        v: 1
      },
      {
        type: "rock",
        x: 19007,
        s: 0.99,
        v: 1
      },
      {
        type: "pine",
        x: 19738,
        s: 0.76,
        v: 2
      },
      {
        type: "spire",
        x: 20433,
        s: 0.82,
        v: 0
      },
      {
        type: "rock",
        x: 20973,
        s: 0.79,
        v: 1
      },
      {
        type: "pine",
        x: 21622,
        s: 0.98,
        v: 0
      },
      {
        type: "spire",
        x: 22221,
        s: 0.96,
        v: 2
      },
      {
        type: "pine",
        x: 22763,
        s: 0.99,
        v: 1
      },
      {
        type: "spire",
        x: 23208,
        s: 0.93,
        v: 0
      },
      {
        type: "pine",
        x: 23820,
        s: 0.78,
        v: 2
      },
      {
        type: "spire",
        x: 24218,
        s: 0.88,
        v: 0
      },
      {
        type: "rock",
        x: 24886,
        s: 1,
        v: 2
      },
      {
        type: "rock",
        x: 25299,
        s: 0.85,
        v: 0
      },
      {
        type: "snowman",
        x: 11808,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 26200
      }
    ]
  };

  // src/data/levels/island05.json
  var island05_default = {
    id: "island05",
    name: {
      ko: "\uB178\uC744 \uC808\uBCBD",
      en: "Sunset Cliffs"
    },
    biome: "sunset",
    surface: "snow",
    intro: null,
    points: [
      [
        0,
        520
      ],
      [
        1256,
        -482
      ],
      [
        2410,
        485
      ],
      [
        3791,
        -454
      ],
      [
        5133,
        463
      ],
      [
        5755,
        -277
      ],
      [
        6371,
        235
      ],
      [
        7030,
        -313
      ],
      [
        7644,
        223
      ],
      [
        8286,
        -235
      ],
      [
        8885,
        208
      ],
      [
        9313,
        10
      ],
      [
        9741,
        318
      ],
      [
        10178,
        136
      ],
      [
        10615,
        428
      ],
      [
        11063,
        238
      ],
      [
        11511,
        538
      ],
      [
        12400,
        -392
      ],
      [
        13318,
        371
      ],
      [
        13622,
        -133
      ],
      [
        13943,
        82
      ],
      [
        14302,
        -107
      ],
      [
        14651,
        66
      ],
      [
        15005,
        -97
      ],
      [
        15342,
        79
      ],
      [
        16e3,
        -283
      ],
      [
        16635,
        314
      ],
      [
        17313,
        -269
      ],
      [
        17952,
        367
      ],
      [
        18595,
        -284
      ],
      [
        19285,
        370
      ],
      [
        20641,
        -439
      ],
      [
        21959,
        474
      ],
      [
        23285,
        -410
      ],
      [
        24584,
        520
      ],
      [
        25200,
        -248
      ],
      [
        25832,
        281
      ],
      [
        26437,
        -257
      ],
      [
        27051,
        218
      ],
      [
        27727,
        -274
      ],
      [
        28453,
        187
      ],
      [
        29329,
        -443
      ],
      [
        30260,
        291
      ],
      [
        30900,
        -200
      ],
      [
        31720,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 2234,
        y: 592
      },
      {
        type: "single",
        x: 2372,
        y: 782
      },
      {
        type: "single",
        x: 2509,
        y: 957
      },
      {
        type: "single",
        x: 2645,
        y: 1115
      },
      {
        type: "single",
        x: 2779,
        y: 1257
      },
      {
        type: "single",
        x: 2913,
        y: 1383
      },
      {
        type: "single",
        x: 3046,
        y: 1494
      },
      {
        type: "single",
        x: 3956,
        y: 1835
      },
      {
        type: "single",
        x: 4084,
        y: 1824
      },
      {
        type: "single",
        x: 4211,
        y: 1800
      },
      {
        type: "single",
        x: 4337,
        y: 1763
      },
      {
        type: "single",
        x: 4463,
        y: 1712
      },
      {
        type: "single",
        x: 4588,
        y: 1639
      },
      {
        type: "single",
        x: 4713,
        y: 1523
      },
      {
        type: "single",
        x: 6381,
        y: 496
      },
      {
        type: "single",
        x: 6495,
        y: 670
      },
      {
        type: "single",
        x: 6608,
        y: 834
      },
      {
        type: "single",
        x: 6721,
        y: 992
      },
      {
        type: "single",
        x: 6833,
        y: 1145
      },
      {
        type: "single",
        x: 6944,
        y: 1269
      },
      {
        type: "single",
        x: 7055,
        y: 1341
      },
      {
        type: "single",
        x: 8028,
        y: 1803
      },
      {
        type: "single",
        x: 8134,
        y: 1826
      },
      {
        type: "single",
        x: 8239,
        y: 1838
      },
      {
        type: "single",
        x: 8345,
        y: 1846
      },
      {
        type: "single",
        x: 8449,
        y: 1851
      },
      {
        type: "single",
        x: 8554,
        y: 1851
      },
      {
        type: "single",
        x: 8658,
        y: 1848
      },
      {
        type: "single",
        x: 9576,
        y: 1670
      },
      {
        type: "single",
        x: 9676,
        y: 1627
      },
      {
        type: "single",
        x: 9775,
        y: 1572
      },
      {
        type: "single",
        x: 9875,
        y: 1513
      },
      {
        type: "single",
        x: 9974,
        y: 1450
      },
      {
        type: "single",
        x: 10072,
        y: 1379
      },
      {
        type: "single",
        x: 10170,
        y: 1298
      },
      {
        type: "single",
        x: 11546,
        y: 738
      },
      {
        type: "single",
        x: 11647,
        y: 871
      },
      {
        type: "single",
        x: 11748,
        y: 1e3
      },
      {
        type: "single",
        x: 11848,
        y: 1124
      },
      {
        type: "single",
        x: 11947,
        y: 1244
      },
      {
        type: "single",
        x: 12046,
        y: 1359
      },
      {
        type: "single",
        x: 12145,
        y: 1470
      },
      {
        type: "single",
        x: 13104,
        y: 2204
      },
      {
        type: "single",
        x: 13197,
        y: 2254
      },
      {
        type: "single",
        x: 13291,
        y: 2299
      },
      {
        type: "single",
        x: 13384,
        y: 2341
      },
      {
        type: "single",
        x: 13477,
        y: 2374
      },
      {
        type: "single",
        x: 13569,
        y: 2396
      },
      {
        type: "single",
        x: 13661,
        y: 2406
      },
      {
        type: "single",
        x: 14565,
        y: 2201
      },
      {
        type: "single",
        x: 14654,
        y: 2162
      },
      {
        type: "single",
        x: 14742,
        y: 2120
      },
      {
        type: "single",
        x: 14830,
        y: 2074
      },
      {
        type: "single",
        x: 14918,
        y: 2025
      },
      {
        type: "single",
        x: 15006,
        y: 1973
      },
      {
        type: "single",
        x: 15093,
        y: 1918
      },
      {
        type: "single",
        x: 16029,
        y: 1115
      },
      {
        type: "single",
        x: 16112,
        y: 1036
      },
      {
        type: "single",
        x: 16195,
        y: 961
      },
      {
        type: "single",
        x: 16277,
        y: 884
      },
      {
        type: "single",
        x: 16359,
        y: 805
      },
      {
        type: "single",
        x: 16441,
        y: 722
      },
      {
        type: "single",
        x: 16522,
        y: 636
      },
      {
        type: "single",
        x: 17925,
        y: 610
      },
      {
        type: "single",
        x: 18020,
        y: 788
      },
      {
        type: "single",
        x: 18115,
        y: 960
      },
      {
        type: "single",
        x: 18208,
        y: 1128
      },
      {
        type: "single",
        x: 18302,
        y: 1291
      },
      {
        type: "single",
        x: 18394,
        y: 1449
      },
      {
        type: "single",
        x: 18486,
        y: 1602
      },
      {
        type: "single",
        x: 19391,
        y: 2901
      },
      {
        type: "single",
        x: 19478,
        y: 3005
      },
      {
        type: "single",
        x: 19564,
        y: 3104
      },
      {
        type: "single",
        x: 19649,
        y: 3196
      },
      {
        type: "single",
        x: 19734,
        y: 3277
      },
      {
        type: "single",
        x: 19819,
        y: 3346
      },
      {
        type: "single",
        x: 19904,
        y: 3403
      },
      {
        type: "single",
        x: 20816,
        y: 3292
      },
      {
        type: "single",
        x: 20897,
        y: 3215
      },
      {
        type: "single",
        x: 20978,
        y: 3128
      },
      {
        type: "single",
        x: 21059,
        y: 3030
      },
      {
        type: "single",
        x: 21139,
        y: 2928
      },
      {
        type: "single",
        x: 21219,
        y: 2824
      },
      {
        type: "single",
        x: 21298,
        y: 2717
      },
      {
        type: "single",
        x: 22220,
        y: 1214
      },
      {
        type: "single",
        x: 22294,
        y: 1071
      },
      {
        type: "single",
        x: 22368,
        y: 926
      },
      {
        type: "single",
        x: 22441,
        y: 779
      },
      {
        type: "single",
        x: 22514,
        y: 629
      },
      {
        type: "single",
        x: 22587,
        y: 476
      },
      {
        type: "single",
        x: 22659,
        y: 321
      },
      {
        type: "single",
        x: 24315,
        y: 574
      },
      {
        type: "single",
        x: 24418,
        y: 714
      },
      {
        type: "single",
        x: 24519,
        y: 849
      },
      {
        type: "single",
        x: 24620,
        y: 979
      },
      {
        type: "single",
        x: 24720,
        y: 1103
      },
      {
        type: "single",
        x: 24820,
        y: 1214
      },
      {
        type: "single",
        x: 24919,
        y: 1314
      },
      {
        type: "single",
        x: 25889,
        y: 1778
      },
      {
        type: "single",
        x: 25984,
        y: 1787
      },
      {
        type: "single",
        x: 26078,
        y: 1792
      },
      {
        type: "single",
        x: 26173,
        y: 1793
      },
      {
        type: "single",
        x: 26267,
        y: 1791
      },
      {
        type: "single",
        x: 26361,
        y: 1785
      },
      {
        type: "single",
        x: 26454,
        y: 1776
      },
      {
        type: "single",
        x: 27371,
        y: 1505
      },
      {
        type: "single",
        x: 27461,
        y: 1460
      },
      {
        type: "single",
        x: 27550,
        y: 1411
      },
      {
        type: "single",
        x: 27639,
        y: 1360
      },
      {
        type: "single",
        x: 27728,
        y: 1305
      },
      {
        type: "single",
        x: 27817,
        y: 1241
      },
      {
        type: "single",
        x: 27905,
        y: 1165
      },
      {
        type: "single",
        x: 30132,
        y: 449
      },
      {
        type: "single",
        x: 30244,
        y: 621
      },
      {
        type: "single",
        x: 30355,
        y: 787
      },
      {
        type: "single",
        x: 30465,
        y: 949
      },
      {
        type: "single",
        x: 30574,
        y: 1105
      },
      {
        type: "single",
        x: 30683,
        y: 1257
      },
      {
        type: "single",
        x: 30791,
        y: 1404
      },
      {
        type: "single",
        x: 3363,
        y: 2024
      },
      {
        type: "single",
        x: 3437,
        y: 2086
      },
      {
        type: "single",
        x: 3511,
        y: 2145
      },
      {
        type: "single",
        x: 3585,
        y: 2199
      },
      {
        type: "single",
        x: 3659,
        y: 2250
      },
      {
        type: "single",
        x: 3733,
        y: 2297
      },
      {
        type: "single",
        x: 3806,
        y: 2335
      },
      {
        type: "single",
        x: 7321,
        y: 2010
      },
      {
        type: "single",
        x: 7442,
        y: 2173
      },
      {
        type: "single",
        x: 7562,
        y: 2325
      },
      {
        type: "single",
        x: 7681,
        y: 2465
      },
      {
        type: "single",
        x: 7800,
        y: 2593
      },
      {
        type: "single",
        x: 7918,
        y: 2709
      },
      {
        type: "single",
        x: 8036,
        y: 2813
      },
      {
        type: "single",
        x: 10510,
        y: 2638
      },
      {
        type: "single",
        x: 10617,
        y: 2518
      },
      {
        type: "single",
        x: 10724,
        y: 2387
      },
      {
        type: "single",
        x: 10831,
        y: 2245
      },
      {
        type: "single",
        x: 10936,
        y: 2093
      },
      {
        type: "single",
        x: 11041,
        y: 1931
      },
      {
        type: "single",
        x: 11146,
        y: 1758
      },
      {
        type: "single",
        x: 13950,
        y: 1783
      },
      {
        type: "single",
        x: 14064,
        y: 1942
      },
      {
        type: "single",
        x: 14176,
        y: 2089
      },
      {
        type: "single",
        x: 14288,
        y: 2224
      },
      {
        type: "single",
        x: 14400,
        y: 2347
      },
      {
        type: "single",
        x: 14511,
        y: 2458
      },
      {
        type: "single",
        x: 14621,
        y: 2558
      },
      {
        type: "single",
        x: 16843,
        y: 2630
      },
      {
        type: "single",
        x: 16944,
        y: 2514
      },
      {
        type: "single",
        x: 17045,
        y: 2388
      },
      {
        type: "single",
        x: 17145,
        y: 2251
      },
      {
        type: "single",
        x: 17245,
        y: 2103
      },
      {
        type: "single",
        x: 17344,
        y: 1946
      },
      {
        type: "single",
        x: 17443,
        y: 1777
      },
      {
        type: "single",
        x: 20216,
        y: 2371
      },
      {
        type: "single",
        x: 20331,
        y: 2540
      },
      {
        type: "single",
        x: 20445,
        y: 2697
      },
      {
        type: "single",
        x: 20558,
        y: 2842
      },
      {
        type: "single",
        x: 20671,
        y: 2975
      },
      {
        type: "single",
        x: 20783,
        y: 3096
      },
      {
        type: "single",
        x: 20895,
        y: 3205
      },
      {
        type: "single",
        x: 22950,
        y: 3870
      },
      {
        type: "single",
        x: 23053,
        y: 3851
      },
      {
        type: "single",
        x: 23157,
        y: 3829
      },
      {
        type: "single",
        x: 23260,
        y: 3805
      },
      {
        type: "single",
        x: 23362,
        y: 3777
      },
      {
        type: "single",
        x: 23464,
        y: 3747
      },
      {
        type: "single",
        x: 23566,
        y: 3710
      },
      {
        type: "single",
        x: 25238,
        y: 1976
      },
      {
        type: "single",
        x: 25332,
        y: 1799
      },
      {
        type: "single",
        x: 25425,
        y: 1612
      },
      {
        type: "single",
        x: 25518,
        y: 1416
      },
      {
        type: "single",
        x: 25610,
        y: 1210
      },
      {
        type: "single",
        x: 25702,
        y: 1e3
      },
      {
        type: "single",
        x: 25793,
        y: 790
      },
      {
        type: "single",
        x: 28232,
        y: 2200
      },
      {
        type: "single",
        x: 28376,
        y: 2396
      },
      {
        type: "single",
        x: 28519,
        y: 2586
      },
      {
        type: "single",
        x: 28662,
        y: 2771
      },
      {
        type: "single",
        x: 28803,
        y: 2951
      },
      {
        type: "single",
        x: 28943,
        y: 3126
      },
      {
        type: "single",
        x: 29082,
        y: 3296
      },
      {
        type: "ground",
        x: 7764,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 15462,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 18072,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 19405,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 24704,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "arc",
        x: 18032,
        y: 1217,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 22039,
        y: 1324,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 13398,
        y: 1221,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      }
    ],
    blizzard: {
      startGap: 1250,
      speed: 700,
      accel: 7
    },
    expect: {
      upgrades: {
        flap: 4,
        slide: 3,
        magnet: 2,
        glide: 1
      }
    },
    goals: [
      {
        type: "fish",
        n: 140
      },
      {
        type: "fever",
        n: 2
      }
    ],
    ice: [
      [
        7704,
        8326
      ],
      [
        11571,
        12440
      ],
      [
        14003,
        14342
      ],
      [
        18012,
        18635
      ]
    ],
    wind: [
      {
        x: 6870,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 12240,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 15840,
        w: 320,
        h: 1500,
        power: 1
      }
    ],
    geysers: [],
    rings: [],
    decor: [
      {
        type: "sign",
        x: 340
      },
      {
        type: "rock",
        x: 700,
        s: 1.08,
        v: 0
      },
      {
        type: "spire",
        x: 1422,
        s: 0.93,
        v: 2
      },
      {
        type: "spire",
        x: 1976,
        s: 0.83,
        v: 1
      },
      {
        type: "pine",
        x: 2559,
        s: 0.96,
        v: 2
      },
      {
        type: "pine",
        x: 3145,
        s: 0.81,
        v: 2
      },
      {
        type: "spire",
        x: 3770,
        s: 0.77,
        v: 2
      },
      {
        type: "spire",
        x: 4183,
        s: 0.91,
        v: 1
      },
      {
        type: "rock",
        x: 4910,
        s: 0.92,
        v: 0
      },
      {
        type: "pine",
        x: 5343,
        s: 0.94,
        v: 2
      },
      {
        type: "rock",
        x: 5860,
        s: 0.85,
        v: 1
      },
      {
        type: "pine",
        x: 6563,
        s: 1.04,
        v: 0
      },
      {
        type: "rock",
        x: 7024,
        s: 0.99,
        v: 0
      },
      {
        type: "rock",
        x: 7674,
        s: 0.75,
        v: 1
      },
      {
        type: "pine",
        x: 8073,
        s: 0.96,
        v: 1
      },
      {
        type: "spire",
        x: 8582,
        s: 0.87,
        v: 1
      },
      {
        type: "pine",
        x: 9002,
        s: 0.78,
        v: 1
      },
      {
        type: "pine",
        x: 9407,
        s: 0.77,
        v: 1
      },
      {
        type: "rock",
        x: 10001,
        s: 0.83,
        v: 2
      },
      {
        type: "rock",
        x: 10588,
        s: 1.05,
        v: 1
      },
      {
        type: "rock",
        x: 11286,
        s: 1.09,
        v: 2
      },
      {
        type: "spire",
        x: 11820,
        s: 1,
        v: 2
      },
      {
        type: "rock",
        x: 12244,
        s: 0.98,
        v: 1
      },
      {
        type: "rock",
        x: 12868,
        s: 1,
        v: 1
      },
      {
        type: "pine",
        x: 13304,
        s: 0.93,
        v: 1
      },
      {
        type: "pine",
        x: 13866,
        s: 1.09,
        v: 2
      },
      {
        type: "spire",
        x: 14487,
        s: 1.02,
        v: 1
      },
      {
        type: "spire",
        x: 14914,
        s: 0.95,
        v: 1
      },
      {
        type: "spire",
        x: 15432,
        s: 0.76,
        v: 1
      },
      {
        type: "spire",
        x: 15862,
        s: 0.91,
        v: 1
      },
      {
        type: "pine",
        x: 16471,
        s: 0.83,
        v: 2
      },
      {
        type: "spire",
        x: 16994,
        s: 0.91,
        v: 0
      },
      {
        type: "pine",
        x: 17648,
        s: 0.86,
        v: 1
      },
      {
        type: "rock",
        x: 18320,
        s: 0.83,
        v: 1
      },
      {
        type: "rock",
        x: 18824,
        s: 1.05,
        v: 2
      },
      {
        type: "rock",
        x: 19219,
        s: 0.93,
        v: 0
      },
      {
        type: "rock",
        x: 19743,
        s: 0.99,
        v: 1
      },
      {
        type: "rock",
        x: 20367,
        s: 1.08,
        v: 1
      },
      {
        type: "spire",
        x: 21001,
        s: 0.91,
        v: 0
      },
      {
        type: "spire",
        x: 21417,
        s: 0.82,
        v: 2
      },
      {
        type: "rock",
        x: 22158,
        s: 0.82,
        v: 2
      },
      {
        type: "rock",
        x: 22864,
        s: 1.09,
        v: 0
      },
      {
        type: "spire",
        x: 23333,
        s: 0.92,
        v: 1
      },
      {
        type: "spire",
        x: 23768,
        s: 0.8,
        v: 1
      },
      {
        type: "pine",
        x: 24381,
        s: 1.07,
        v: 0
      },
      {
        type: "spire",
        x: 24953,
        s: 0.81,
        v: 1
      },
      {
        type: "spire",
        x: 25339,
        s: 0.85,
        v: 1
      },
      {
        type: "spire",
        x: 25975,
        s: 1.01,
        v: 0
      },
      {
        type: "rock",
        x: 26534,
        s: 0.9,
        v: 1
      },
      {
        type: "rock",
        x: 27121,
        s: 0.79,
        v: 0
      },
      {
        type: "spire",
        x: 27563,
        s: 1.07,
        v: 2
      },
      {
        type: "pine",
        x: 28208,
        s: 1.01,
        v: 2
      },
      {
        type: "rock",
        x: 28662,
        s: 0.98,
        v: 0
      },
      {
        type: "rock",
        x: 29091,
        s: 0.83,
        v: 0
      },
      {
        type: "spire",
        x: 29687,
        s: 0.93,
        v: 1
      },
      {
        type: "spire",
        x: 30280,
        s: 1.07,
        v: 1
      },
      {
        type: "rock",
        x: 30946,
        s: 1.07,
        v: 0
      },
      {
        type: "snowman",
        x: 14274,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 31680
      }
    ]
  };

  // src/data/levels/island06.json
  var island06_default = {
    id: "island06",
    name: {
      ko: "\uAE40 \uC11C\uB9B0 \uC12C",
      en: "Steam Isle"
    },
    biome: "geyser",
    surface: "snow",
    intro: "geyser",
    points: [
      [
        0,
        520
      ],
      [
        679,
        -217
      ],
      [
        1300,
        281
      ],
      [
        1925,
        -219
      ],
      [
        2578,
        243
      ],
      [
        3192,
        -290
      ],
      [
        3845,
        245
      ],
      [
        4500,
        -355
      ],
      [
        5171,
        277
      ],
      [
        5852,
        -371
      ],
      [
        6492,
        235
      ],
      [
        7201,
        -354
      ],
      [
        7936,
        238
      ],
      [
        8291,
        -192
      ],
      [
        8668,
        -2
      ],
      [
        9005,
        -207
      ],
      [
        9366,
        5
      ],
      [
        9706,
        -205
      ],
      [
        10018,
        9
      ],
      [
        10652,
        -344
      ],
      [
        11333,
        104
      ],
      [
        11980,
        -354
      ],
      [
        12572,
        114
      ],
      [
        13224,
        -339
      ],
      [
        13844,
        120
      ],
      [
        14771,
        -499
      ],
      [
        15763,
        275
      ],
      [
        16666,
        -499
      ],
      [
        17531,
        259
      ],
      [
        18218,
        -447
      ],
      [
        18893,
        207
      ],
      [
        19553,
        -393
      ],
      [
        20240,
        190
      ],
      [
        20953,
        -425
      ],
      [
        21643,
        185
      ],
      [
        22307,
        -400
      ],
      [
        22931,
        160
      ],
      [
        23555,
        -341
      ],
      [
        24214,
        101
      ],
      [
        24816,
        -347
      ],
      [
        25383,
        145
      ],
      [
        26005,
        -353
      ],
      [
        26628,
        162
      ],
      [
        27958,
        -565
      ],
      [
        29166,
        364
      ],
      [
        29806,
        -200
      ],
      [
        30626,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 1383,
        y: 605
      },
      {
        type: "single",
        x: 1457,
        y: 686
      },
      {
        type: "single",
        x: 1532,
        y: 756
      },
      {
        type: "single",
        x: 1606,
        y: 814
      },
      {
        type: "single",
        x: 1681,
        y: 861
      },
      {
        type: "single",
        x: 1755,
        y: 897
      },
      {
        type: "single",
        x: 1828,
        y: 921
      },
      {
        type: "single",
        x: 3815,
        y: 463
      },
      {
        type: "single",
        x: 3907,
        y: 611
      },
      {
        type: "single",
        x: 4e3,
        y: 755
      },
      {
        type: "single",
        x: 4091,
        y: 894
      },
      {
        type: "single",
        x: 4182,
        y: 1029
      },
      {
        type: "single",
        x: 4273,
        y: 1159
      },
      {
        type: "single",
        x: 4363,
        y: 1284
      },
      {
        type: "single",
        x: 5331,
        y: 2124
      },
      {
        type: "single",
        x: 5417,
        y: 2168
      },
      {
        type: "single",
        x: 5503,
        y: 2209
      },
      {
        type: "single",
        x: 5589,
        y: 2246
      },
      {
        type: "single",
        x: 5674,
        y: 2279
      },
      {
        type: "single",
        x: 5759,
        y: 2308
      },
      {
        type: "single",
        x: 5844,
        y: 2334
      },
      {
        type: "single",
        x: 6829,
        y: 2307
      },
      {
        type: "single",
        x: 6911,
        y: 2256
      },
      {
        type: "single",
        x: 6992,
        y: 2193
      },
      {
        type: "single",
        x: 7073,
        y: 2120
      },
      {
        type: "single",
        x: 7154,
        y: 2040
      },
      {
        type: "single",
        x: 7235,
        y: 1957
      },
      {
        type: "single",
        x: 7315,
        y: 1871
      },
      {
        type: "single",
        x: 8940,
        y: 13
      },
      {
        type: "single",
        x: 9012,
        y: 135
      },
      {
        type: "single",
        x: 9083,
        y: 241
      },
      {
        type: "single",
        x: 9155,
        y: 331
      },
      {
        type: "single",
        x: 9226,
        y: 407
      },
      {
        type: "single",
        x: 9296,
        y: 467
      },
      {
        type: "single",
        x: 9367,
        y: 511
      },
      {
        type: "single",
        x: 10533,
        y: -110
      },
      {
        type: "single",
        x: 10646,
        y: 13
      },
      {
        type: "single",
        x: 10759,
        y: 120
      },
      {
        type: "single",
        x: 10871,
        y: 211
      },
      {
        type: "single",
        x: 10983,
        y: 277
      },
      {
        type: "single",
        x: 11094,
        y: 298
      },
      {
        type: "single",
        x: 11205,
        y: 274
      },
      {
        type: "single",
        x: 12542,
        y: 271
      },
      {
        type: "single",
        x: 12662,
        y: 434
      },
      {
        type: "single",
        x: 12781,
        y: 582
      },
      {
        type: "single",
        x: 12899,
        y: 713
      },
      {
        type: "single",
        x: 13017,
        y: 829
      },
      {
        type: "single",
        x: 13134,
        y: 926
      },
      {
        type: "single",
        x: 13251,
        y: 981
      },
      {
        type: "single",
        x: 15603,
        y: 402
      },
      {
        type: "single",
        x: 15699,
        y: 547
      },
      {
        type: "single",
        x: 15794,
        y: 688
      },
      {
        type: "single",
        x: 15888,
        y: 825
      },
      {
        type: "single",
        x: 15982,
        y: 957
      },
      {
        type: "single",
        x: 16075,
        y: 1084
      },
      {
        type: "single",
        x: 16168,
        y: 1207
      },
      {
        type: "single",
        x: 17163,
        y: 2182
      },
      {
        type: "single",
        x: 17252,
        y: 2213
      },
      {
        type: "single",
        x: 17340,
        y: 2233
      },
      {
        type: "single",
        x: 17428,
        y: 2241
      },
      {
        type: "single",
        x: 17515,
        y: 2238
      },
      {
        type: "single",
        x: 17603,
        y: 2224
      },
      {
        type: "single",
        x: 17690,
        y: 2199
      },
      {
        type: "single",
        x: 18709,
        y: 1041
      },
      {
        type: "single",
        x: 18792,
        y: 875
      },
      {
        type: "single",
        x: 18873,
        y: 699
      },
      {
        type: "single",
        x: 18955,
        y: 514
      },
      {
        type: "single",
        x: 19035,
        y: 323
      },
      {
        type: "single",
        x: 20241,
        y: 336
      },
      {
        type: "single",
        x: 20312,
        y: 424
      },
      {
        type: "single",
        x: 20384,
        y: 508
      },
      {
        type: "single",
        x: 20455,
        y: 588
      },
      {
        type: "single",
        x: 20526,
        y: 664
      },
      {
        type: "single",
        x: 20597,
        y: 736
      },
      {
        type: "single",
        x: 20667,
        y: 804
      },
      {
        type: "single",
        x: 22847,
        y: 297
      },
      {
        type: "single",
        x: 22963,
        y: 506
      },
      {
        type: "single",
        x: 23077,
        y: 710
      },
      {
        type: "single",
        x: 23191,
        y: 905
      },
      {
        type: "single",
        x: 23304,
        y: 1087
      },
      {
        type: "single",
        x: 23417,
        y: 1257
      },
      {
        type: "single",
        x: 23528,
        y: 1415
      },
      {
        type: "single",
        x: 24507,
        y: 2314
      },
      {
        type: "single",
        x: 24613,
        y: 2370
      },
      {
        type: "single",
        x: 24719,
        y: 2415
      },
      {
        type: "single",
        x: 24824,
        y: 2448
      },
      {
        type: "single",
        x: 24929,
        y: 2470
      },
      {
        type: "single",
        x: 25034,
        y: 2480
      },
      {
        type: "single",
        x: 25138,
        y: 2480
      },
      {
        type: "single",
        x: 26160,
        y: 1934
      },
      {
        type: "single",
        x: 26260,
        y: 1830
      },
      {
        type: "single",
        x: 26360,
        y: 1714
      },
      {
        type: "single",
        x: 26459,
        y: 1589
      },
      {
        type: "single",
        x: 26557,
        y: 1453
      },
      {
        type: "single",
        x: 26655,
        y: 1306
      },
      {
        type: "single",
        x: 26752,
        y: 1149
      },
      {
        type: "single",
        x: 28858,
        y: 352
      },
      {
        type: "single",
        x: 28975,
        y: 534
      },
      {
        type: "single",
        x: 29090,
        y: 711
      },
      {
        type: "single",
        x: 29205,
        y: 884
      },
      {
        type: "single",
        x: 29319,
        y: 1051
      },
      {
        type: "single",
        x: 29433,
        y: 1213
      },
      {
        type: "single",
        x: 29545,
        y: 1371
      },
      {
        type: "single",
        x: 2418,
        y: 1906
      },
      {
        type: "single",
        x: 2496,
        y: 1946
      },
      {
        type: "single",
        x: 2574,
        y: 1983
      },
      {
        type: "single",
        x: 2652,
        y: 2010
      },
      {
        type: "single",
        x: 2729,
        y: 2026
      },
      {
        type: "single",
        x: 2807,
        y: 2030
      },
      {
        type: "single",
        x: 2884,
        y: 2024
      },
      {
        type: "single",
        x: 6390,
        y: 330
      },
      {
        type: "single",
        x: 6524,
        y: 572
      },
      {
        type: "single",
        x: 6657,
        y: 797
      },
      {
        type: "single",
        x: 6790,
        y: 984
      },
      {
        type: "single",
        x: 6921,
        y: 1145
      },
      {
        type: "single",
        x: 7052,
        y: 1289
      },
      {
        type: "single",
        x: 7183,
        y: 1418
      },
      {
        type: "single",
        x: 9789,
        y: -62
      },
      {
        type: "single",
        x: 9888,
        y: 15
      },
      {
        type: "single",
        x: 9987,
        y: 88
      },
      {
        type: "single",
        x: 10086,
        y: 157
      },
      {
        type: "single",
        x: 10185,
        y: 221
      },
      {
        type: "single",
        x: 10283,
        y: 282
      },
      {
        type: "single",
        x: 10381,
        y: 333
      },
      {
        type: "single",
        x: 13738,
        y: 185
      },
      {
        type: "single",
        x: 13864,
        y: 365
      },
      {
        type: "single",
        x: 13990,
        y: 529
      },
      {
        type: "single",
        x: 14114,
        y: 677
      },
      {
        type: "single",
        x: 14239,
        y: 809
      },
      {
        type: "single",
        x: 14362,
        y: 926
      },
      {
        type: "single",
        x: 14485,
        y: 1028
      },
      {
        type: "single",
        x: 18015,
        y: 1365
      },
      {
        type: "single",
        x: 18112,
        y: 1500
      },
      {
        type: "single",
        x: 18208,
        y: 1630
      },
      {
        type: "single",
        x: 18304,
        y: 1757
      },
      {
        type: "single",
        x: 18400,
        y: 1878
      },
      {
        type: "single",
        x: 18495,
        y: 1996
      },
      {
        type: "single",
        x: 18590,
        y: 2109
      },
      {
        type: "single",
        x: 20947,
        y: 2542
      },
      {
        type: "single",
        x: 21034,
        y: 2478
      },
      {
        type: "single",
        x: 21121,
        y: 2412
      },
      {
        type: "single",
        x: 21208,
        y: 2339
      },
      {
        type: "single",
        x: 21294,
        y: 2255
      },
      {
        type: "single",
        x: 21380,
        y: 2163
      },
      {
        type: "single",
        x: 21466,
        y: 2069
      },
      {
        type: "single",
        x: 24080,
        y: 142
      },
      {
        type: "single",
        x: 24151,
        y: 240
      },
      {
        type: "single",
        x: 24222,
        y: 334
      },
      {
        type: "single",
        x: 24293,
        y: 424
      },
      {
        type: "single",
        x: 24363,
        y: 510
      },
      {
        type: "single",
        x: 24433,
        y: 588
      },
      {
        type: "single",
        x: 24503,
        y: 654
      },
      {
        type: "ground",
        x: 10138,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 11453,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 17651,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 21763,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "arc",
        x: 15843,
        y: 1225,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 29246,
        y: 1314,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 23011,
        y: 1110,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      }
    ],
    blizzard: {
      startGap: 1300,
      speed: 800,
      accel: 8
    },
    expect: {
      upgrades: {
        flap: 5,
        slide: 4,
        magnet: 2,
        glide: 2,
        scarf: 1
      }
    },
    goals: [
      {
        type: "height",
        n: 200
      },
      {
        type: "gold",
        n: 2
      }
    ],
    ice: [],
    wind: [],
    geysers: [
      {
        x: 8911
      },
      {
        x: 9611
      },
      {
        x: 10474
      },
      {
        x: 19368
      },
      {
        x: 20753
      }
    ],
    rings: [],
    decor: [
      {
        type: "sign",
        x: 340
      },
      {
        type: "spire",
        x: 700,
        s: 1.05,
        v: 2
      },
      {
        type: "spire",
        x: 1368,
        s: 1.09,
        v: 1
      },
      {
        type: "spire",
        x: 1955,
        s: 0.83,
        v: 0
      },
      {
        type: "spire",
        x: 2497,
        s: 0.97,
        v: 1
      },
      {
        type: "rock",
        x: 3145,
        s: 0.83,
        v: 0
      },
      {
        type: "spire",
        x: 3833,
        s: 0.76,
        v: 2
      },
      {
        type: "spire",
        x: 4541,
        s: 0.81,
        v: 1
      },
      {
        type: "rock",
        x: 5044,
        s: 1.03,
        v: 1
      },
      {
        type: "rock",
        x: 5545,
        s: 0.89,
        v: 1
      },
      {
        type: "rock",
        x: 6073,
        s: 1.03,
        v: 0
      },
      {
        type: "rock",
        x: 6455,
        s: 0.99,
        v: 2
      },
      {
        type: "rock",
        x: 6881,
        s: 1.01,
        v: 2
      },
      {
        type: "spire",
        x: 7278,
        s: 0.96,
        v: 0
      },
      {
        type: "spire",
        x: 7910,
        s: 1.08,
        v: 1
      },
      {
        type: "spire",
        x: 8629,
        s: 0.84,
        v: 1
      },
      {
        type: "rock",
        x: 9363,
        s: 0.8,
        v: 1
      },
      {
        type: "spire",
        x: 10003,
        s: 0.79,
        v: 0
      },
      {
        type: "rock",
        x: 10522,
        s: 0.98,
        v: 2
      },
      {
        type: "rock",
        x: 10973,
        s: 0.82,
        v: 2
      },
      {
        type: "spire",
        x: 11596,
        s: 0.99,
        v: 2
      },
      {
        type: "rock",
        x: 12019,
        s: 1,
        v: 2
      },
      {
        type: "spire",
        x: 12566,
        s: 0.82,
        v: 1
      },
      {
        type: "spire",
        x: 13152,
        s: 0.96,
        v: 1
      },
      {
        type: "spire",
        x: 13551,
        s: 1.01,
        v: 0
      },
      {
        type: "rock",
        x: 14032,
        s: 0.91,
        v: 0
      },
      {
        type: "rock",
        x: 14494,
        s: 1.06,
        v: 0
      },
      {
        type: "rock",
        x: 15008,
        s: 0.87,
        v: 0
      },
      {
        type: "rock",
        x: 15563,
        s: 0.81,
        v: 2
      },
      {
        type: "rock",
        x: 16005,
        s: 1.04,
        v: 1
      },
      {
        type: "spire",
        x: 16416,
        s: 0.97,
        v: 1
      },
      {
        type: "rock",
        x: 17117,
        s: 0.94,
        v: 0
      },
      {
        type: "rock",
        x: 17518,
        s: 0.95,
        v: 1
      },
      {
        type: "spire",
        x: 18129,
        s: 1.05,
        v: 2
      },
      {
        type: "spire",
        x: 18823,
        s: 1,
        v: 2
      },
      {
        type: "spire",
        x: 19341,
        s: 1.09,
        v: 0
      },
      {
        type: "rock",
        x: 20064,
        s: 1.05,
        v: 1
      },
      {
        type: "spire",
        x: 20470,
        s: 1,
        v: 1
      },
      {
        type: "rock",
        x: 20877,
        s: 0.9,
        v: 2
      },
      {
        type: "spire",
        x: 21342,
        s: 1.06,
        v: 1
      },
      {
        type: "spire",
        x: 21769,
        s: 0.82,
        v: 2
      },
      {
        type: "rock",
        x: 22465,
        s: 0.8,
        v: 2
      },
      {
        type: "rock",
        x: 22848,
        s: 1.03,
        v: 1
      },
      {
        type: "spire",
        x: 23476,
        s: 0.84,
        v: 1
      },
      {
        type: "rock",
        x: 23934,
        s: 1.02,
        v: 2
      },
      {
        type: "rock",
        x: 24328,
        s: 0.97,
        v: 0
      },
      {
        type: "rock",
        x: 24873,
        s: 0.77,
        v: 0
      },
      {
        type: "rock",
        x: 25377,
        s: 0.89,
        v: 2
      },
      {
        type: "rock",
        x: 25835,
        s: 0.81,
        v: 0
      },
      {
        type: "spire",
        x: 26481,
        s: 0.93,
        v: 2
      },
      {
        type: "rock",
        x: 27191,
        s: 0.95,
        v: 2
      },
      {
        type: "rock",
        x: 27758,
        s: 1.04,
        v: 2
      },
      {
        type: "rock",
        x: 28366,
        s: 0.92,
        v: 1
      },
      {
        type: "spire",
        x: 28928,
        s: 1.06,
        v: 1
      },
      {
        type: "spire",
        x: 29392,
        s: 0.95,
        v: 1
      },
      {
        type: "rock",
        x: 29880,
        s: 0.9,
        v: 1
      },
      {
        type: "snowman",
        x: 13782,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 30586
      }
    ]
  };

  // src/data/levels/island07.json
  var island07_default = {
    id: "island07",
    name: {
      ko: "\uC624\uB85C\uB77C \uC12C",
      en: "Aurora Isle"
    },
    biome: "aurora",
    surface: "snow",
    intro: "ring",
    points: [
      [
        0,
        520
      ],
      [
        657,
        -291
      ],
      [
        1277,
        354
      ],
      [
        1934,
        -212
      ],
      [
        2577,
        352
      ],
      [
        3267,
        -223
      ],
      [
        3917,
        372
      ],
      [
        4611,
        -212
      ],
      [
        5253,
        439
      ],
      [
        5908,
        -101
      ],
      [
        6577,
        341
      ],
      [
        7213,
        -117
      ],
      [
        7813,
        331
      ],
      [
        8487,
        -157
      ],
      [
        9140,
        339
      ],
      [
        10086,
        -293
      ],
      [
        11007,
        515
      ],
      [
        11882,
        -271
      ],
      [
        12815,
        511
      ],
      [
        13154,
        22
      ],
      [
        13504,
        218
      ],
      [
        13831,
        13
      ],
      [
        14141,
        214
      ],
      [
        14470,
        20
      ],
      [
        14814,
        201
      ],
      [
        15527,
        -179
      ],
      [
        16289,
        419
      ],
      [
        16944,
        -183
      ],
      [
        17606,
        423
      ],
      [
        18256,
        -200
      ],
      [
        18895,
        440
      ],
      [
        19551,
        -183
      ],
      [
        20153,
        423
      ],
      [
        21414,
        -349
      ],
      [
        22588,
        577
      ],
      [
        23895,
        -363
      ],
      [
        25217,
        603
      ],
      [
        25822,
        -142
      ],
      [
        26421,
        337
      ],
      [
        27024,
        -154
      ],
      [
        27595,
        318
      ],
      [
        28252,
        -186
      ],
      [
        28955,
        350
      ],
      [
        29894,
        -276
      ],
      [
        30832,
        516
      ],
      [
        31472,
        -200
      ],
      [
        32292,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 1371,
        y: 793
      },
      {
        type: "single",
        x: 1488,
        y: 987
      },
      {
        type: "single",
        x: 1603,
        y: 1152
      },
      {
        type: "single",
        x: 1718,
        y: 1271
      },
      {
        type: "single",
        x: 1832,
        y: 1345
      },
      {
        type: "single",
        x: 1946,
        y: 1380
      },
      {
        type: "single",
        x: 2060,
        y: 1393
      },
      {
        type: "single",
        x: 3861,
        y: 574
      },
      {
        type: "single",
        x: 3971,
        y: 772
      },
      {
        type: "single",
        x: 4082,
        y: 958
      },
      {
        type: "single",
        x: 4191,
        y: 1131
      },
      {
        type: "single",
        x: 4300,
        y: 1292
      },
      {
        type: "single",
        x: 4408,
        y: 1441
      },
      {
        type: "single",
        x: 4515,
        y: 1578
      },
      {
        type: "single",
        x: 5562,
        y: 2670
      },
      {
        type: "single",
        x: 5664,
        y: 2756
      },
      {
        type: "single",
        x: 5765,
        y: 2838
      },
      {
        type: "single",
        x: 5850,
        y: 2903
      },
      {
        type: "single",
        x: 5951,
        y: 2978
      },
      {
        type: "single",
        x: 6051,
        y: 3048
      },
      {
        type: "single",
        x: 6152,
        y: 3115
      },
      {
        type: "single",
        x: 7135,
        y: 3499
      },
      {
        type: "single",
        x: 7232,
        y: 3487
      },
      {
        type: "single",
        x: 7328,
        y: 3465
      },
      {
        type: "single",
        x: 7424,
        y: 3433
      },
      {
        type: "single",
        x: 7520,
        y: 3398
      },
      {
        type: "single",
        x: 7615,
        y: 3360
      },
      {
        type: "single",
        x: 7710,
        y: 3311
      },
      {
        type: "single",
        x: 8731,
        y: 2057
      },
      {
        type: "single",
        x: 8821,
        y: 1881
      },
      {
        type: "single",
        x: 8911,
        y: 1702
      },
      {
        type: "single",
        x: 9e3,
        y: 1522
      },
      {
        type: "single",
        x: 9088,
        y: 1339
      },
      {
        type: "single",
        x: 9176,
        y: 1155
      },
      {
        type: "single",
        x: 9263,
        y: 969
      },
      {
        type: "single",
        x: 10803,
        y: 569
      },
      {
        type: "single",
        x: 10922,
        y: 785
      },
      {
        type: "single",
        x: 11041,
        y: 996
      },
      {
        type: "single",
        x: 11158,
        y: 1201
      },
      {
        type: "single",
        x: 11275,
        y: 1401
      },
      {
        type: "single",
        x: 11391,
        y: 1596
      },
      {
        type: "single",
        x: 11506,
        y: 1786
      },
      {
        type: "single",
        x: 12511,
        y: 3259
      },
      {
        type: "single",
        x: 12619,
        y: 3381
      },
      {
        type: "single",
        x: 12727,
        y: 3492
      },
      {
        type: "single",
        x: 12835,
        y: 3591
      },
      {
        type: "single",
        x: 12941,
        y: 3678
      },
      {
        type: "single",
        x: 13048,
        y: 3753
      },
      {
        type: "single",
        x: 13154,
        y: 3817
      },
      {
        type: "single",
        x: 14195,
        y: 3904
      },
      {
        type: "single",
        x: 14298,
        y: 3861
      },
      {
        type: "single",
        x: 14400,
        y: 3807
      },
      {
        type: "single",
        x: 14501,
        y: 3742
      },
      {
        type: "single",
        x: 14602,
        y: 3668
      },
      {
        type: "single",
        x: 14703,
        y: 3589
      },
      {
        type: "single",
        x: 14803,
        y: 3508
      },
      {
        type: "single",
        x: 15781,
        y: 2136
      },
      {
        type: "single",
        x: 15876,
        y: 1957
      },
      {
        type: "single",
        x: 15970,
        y: 1770
      },
      {
        type: "single",
        x: 16063,
        y: 1573
      },
      {
        type: "single",
        x: 16156,
        y: 1366
      },
      {
        type: "single",
        x: 16248,
        y: 1149
      },
      {
        type: "single",
        x: 16340,
        y: 922
      },
      {
        type: "single",
        x: 17559,
        y: 655
      },
      {
        type: "single",
        x: 17679,
        y: 880
      },
      {
        type: "single",
        x: 17798,
        y: 1099
      },
      {
        type: "single",
        x: 17917,
        y: 1313
      },
      {
        type: "single",
        x: 18035,
        y: 1522
      },
      {
        type: "single",
        x: 18151,
        y: 1720
      },
      {
        type: "single",
        x: 18267,
        y: 1906
      },
      {
        type: "single",
        x: 19281,
        y: 3182
      },
      {
        type: "single",
        x: 19391,
        y: 3280
      },
      {
        type: "single",
        x: 19500,
        y: 3366
      },
      {
        type: "single",
        x: 19609,
        y: 3441
      },
      {
        type: "single",
        x: 19717,
        y: 3504
      },
      {
        type: "single",
        x: 19825,
        y: 3555
      },
      {
        type: "single",
        x: 19932,
        y: 3596
      },
      {
        type: "single",
        x: 20902,
        y: 3439
      },
      {
        type: "single",
        x: 21005,
        y: 3365
      },
      {
        type: "single",
        x: 21109,
        y: 3281
      },
      {
        type: "single",
        x: 21212,
        y: 3186
      },
      {
        type: "single",
        x: 21314,
        y: 3079
      },
      {
        type: "single",
        x: 21416,
        y: 2963
      },
      {
        type: "single",
        x: 21518,
        y: 2835
      },
      {
        type: "single",
        x: 22504,
        y: 1386
      },
      {
        type: "single",
        x: 22600,
        y: 1230
      },
      {
        type: "single",
        x: 22695,
        y: 1071
      },
      {
        type: "single",
        x: 22790,
        y: 911
      },
      {
        type: "single",
        x: 22884,
        y: 749
      },
      {
        type: "single",
        x: 22977,
        y: 585
      },
      {
        type: "single",
        x: 23070,
        y: 419
      },
      {
        type: "single",
        x: 24946,
        y: 702
      },
      {
        type: "single",
        x: 25071,
        y: 891
      },
      {
        type: "single",
        x: 25195,
        y: 1076
      },
      {
        type: "single",
        x: 25319,
        y: 1256
      },
      {
        type: "single",
        x: 25441,
        y: 1431
      },
      {
        type: "single",
        x: 25563,
        y: 1601
      },
      {
        type: "single",
        x: 25684,
        y: 1767
      },
      {
        type: "single",
        x: 26741,
        y: 3045
      },
      {
        type: "single",
        x: 26855,
        y: 3165
      },
      {
        type: "single",
        x: 26969,
        y: 3280
      },
      {
        type: "single",
        x: 27082,
        y: 3391
      },
      {
        type: "single",
        x: 27195,
        y: 3498
      },
      {
        type: "single",
        x: 27307,
        y: 3600
      },
      {
        type: "single",
        x: 27418,
        y: 3698
      },
      {
        type: "single",
        x: 28401,
        y: 4397
      },
      {
        type: "single",
        x: 28508,
        y: 4455
      },
      {
        type: "single",
        x: 28615,
        y: 4509
      },
      {
        type: "single",
        x: 28721,
        y: 4558
      },
      {
        type: "single",
        x: 28827,
        y: 4604
      },
      {
        type: "single",
        x: 28933,
        y: 4646
      },
      {
        type: "single",
        x: 29038,
        y: 4683
      },
      {
        type: "single",
        x: 30071,
        y: 4852
      },
      {
        type: "single",
        x: 30172,
        y: 4849
      },
      {
        type: "single",
        x: 30273,
        y: 4843
      },
      {
        type: "single",
        x: 30374,
        y: 4834
      },
      {
        type: "single",
        x: 30475,
        y: 4822
      },
      {
        type: "single",
        x: 30575,
        y: 4808
      },
      {
        type: "single",
        x: 30675,
        y: 4790
      },
      {
        type: "single",
        x: 2417,
        y: 1214
      },
      {
        type: "single",
        x: 2544,
        y: 1084
      },
      {
        type: "single",
        x: 2670,
        y: 911
      },
      {
        type: "single",
        x: 2796,
        y: 693
      },
      {
        type: "single",
        x: 2921,
        y: 447
      },
      {
        type: "single",
        x: 3045,
        y: 181
      },
      {
        type: "single",
        x: 4786,
        y: 2008
      },
      {
        type: "single",
        x: 4861,
        y: 2093
      },
      {
        type: "single",
        x: 4936,
        y: 2167
      },
      {
        type: "single",
        x: 5010,
        y: 2230
      },
      {
        type: "single",
        x: 5084,
        y: 2281
      },
      {
        type: "single",
        x: 5158,
        y: 2321
      },
      {
        type: "single",
        x: 5232,
        y: 2350
      },
      {
        type: "single",
        x: 6802,
        y: 1367
      },
      {
        type: "single",
        x: 6941,
        y: 1176
      },
      {
        type: "single",
        x: 7080,
        y: 976
      },
      {
        type: "single",
        x: 7217,
        y: 767
      },
      {
        type: "single",
        x: 7353,
        y: 550
      },
      {
        type: "single",
        x: 7489,
        y: 324
      },
      {
        type: "single",
        x: 9596,
        y: 1193
      },
      {
        type: "single",
        x: 9675,
        y: 1287
      },
      {
        type: "single",
        x: 9754,
        y: 1369
      },
      {
        type: "single",
        x: 9833,
        y: 1440
      },
      {
        type: "single",
        x: 9912,
        y: 1500
      },
      {
        type: "single",
        x: 9990,
        y: 1549
      },
      {
        type: "single",
        x: 10068,
        y: 1595
      },
      {
        type: "single",
        x: 11823,
        y: 1401
      },
      {
        type: "single",
        x: 11897,
        y: 1360
      },
      {
        type: "single",
        x: 11972,
        y: 1317
      },
      {
        type: "single",
        x: 12045,
        y: 1271
      },
      {
        type: "single",
        x: 12119,
        y: 1223
      },
      {
        type: "single",
        x: 12193,
        y: 1174
      },
      {
        type: "single",
        x: 12266,
        y: 1122
      },
      {
        type: "single",
        x: 16663,
        y: 1161
      },
      {
        type: "single",
        x: 16789,
        y: 1273
      },
      {
        type: "single",
        x: 16915,
        y: 1340
      },
      {
        type: "single",
        x: 17040,
        y: 1362
      },
      {
        type: "single",
        x: 17165,
        y: 1358
      },
      {
        type: "single",
        x: 17289,
        y: 1337
      },
      {
        type: "single",
        x: 17413,
        y: 1273
      },
      {
        type: "single",
        x: 18949,
        y: 871
      },
      {
        type: "single",
        x: 19031,
        y: 1028
      },
      {
        type: "single",
        x: 19112,
        y: 1181
      },
      {
        type: "single",
        x: 19193,
        y: 1329
      },
      {
        type: "single",
        x: 19273,
        y: 1473
      },
      {
        type: "single",
        x: 19353,
        y: 1613
      },
      {
        type: "single",
        x: 19433,
        y: 1748
      },
      {
        type: "single",
        x: 21780,
        y: 3205
      },
      {
        type: "single",
        x: 21852,
        y: 3128
      },
      {
        type: "single",
        x: 21925,
        y: 3041
      },
      {
        type: "single",
        x: 21997,
        y: 2943
      },
      {
        type: "single",
        x: 22069,
        y: 2833
      },
      {
        type: "single",
        x: 22141,
        y: 2713
      },
      {
        type: "single",
        x: 22212,
        y: 2582
      },
      {
        type: "single",
        x: 25944,
        y: 2218
      },
      {
        type: "single",
        x: 26074,
        y: 2396
      },
      {
        type: "single",
        x: 26203,
        y: 2569
      },
      {
        type: "single",
        x: 26331,
        y: 2738
      },
      {
        type: "single",
        x: 26458,
        y: 2902
      },
      {
        type: "single",
        x: 26585,
        y: 3061
      },
      {
        type: "single",
        x: 26711,
        y: 3216
      },
      {
        type: "single",
        x: 29338,
        y: 5524
      },
      {
        type: "single",
        x: 29452,
        y: 5582
      },
      {
        type: "single",
        x: 29566,
        y: 5635
      },
      {
        type: "single",
        x: 29679,
        y: 5685
      },
      {
        type: "single",
        x: 29792,
        y: 5731
      },
      {
        type: "single",
        x: 29905,
        y: 5773
      },
      {
        type: "single",
        x: 30017,
        y: 5811
      },
      {
        type: "ground",
        x: 2697,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 16409,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 26541,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 27715,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 29075,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "arc",
        x: 17686,
        y: 1423,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 1357,
        y: 1354,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 18975,
        y: 1440,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      }
    ],
    blizzard: {
      startGap: 1300,
      speed: 800,
      accel: 8
    },
    expect: {
      upgrades: {
        flap: 6,
        slide: 5,
        magnet: 3,
        glide: 3,
        scarf: 1
      }
    },
    goals: [
      {
        type: "rings",
        n: 4
      },
      {
        type: "fish",
        n: 200
      }
    ],
    ice: [
      [
        2637,
        3307
      ],
      [
        3977,
        4651
      ],
      [
        5313,
        5948
      ],
      [
        11067,
        11922
      ],
      [
        17666,
        18296
      ],
      [
        18955,
        19591
      ],
      [
        27655,
        28292
      ]
    ],
    wind: [
      {
        x: 11722,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 16784,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 18096,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 26864,
        w: 320,
        h: 1500,
        power: 1
      }
    ],
    geysers: [],
    rings: [
      {
        x: 3176,
        y: 2622,
        r: 100
      },
      {
        x: 4909,
        y: 617,
        r: 100
      },
      {
        x: 6867,
        y: 859,
        r: 100
      },
      {
        x: 9445,
        y: 930,
        r: 100
      },
      {
        x: 13092,
        y: 1244,
        r: 100
      },
      {
        x: 15399,
        y: 3514,
        r: 100
      },
      {
        x: 17102,
        y: 3027,
        r: 100
      },
      {
        x: 18899,
        y: 1298,
        r: 100
      },
      {
        x: 20603,
        y: 1414,
        r: 100
      },
      {
        x: 22314,
        y: 4039,
        r: 100
      },
      {
        x: 24095,
        y: 5092,
        r: 100
      },
      {
        x: 25864,
        y: 4089,
        r: 100
      },
      {
        x: 27579,
        y: 1232,
        r: 100
      },
      {
        x: 31052,
        y: 1027,
        r: 100
      }
    ],
    decor: [
      {
        type: "sign",
        x: 340
      },
      {
        type: "crystal",
        x: 700,
        s: 1.01,
        v: 1
      },
      {
        type: "pine",
        x: 1309,
        s: 0.87,
        v: 0
      },
      {
        type: "pine",
        x: 2063,
        s: 0.92,
        v: 2
      },
      {
        type: "crystal",
        x: 2496,
        s: 0.98,
        v: 1
      },
      {
        type: "pine",
        x: 3116,
        s: 0.76,
        v: 2
      },
      {
        type: "crystal",
        x: 3672,
        s: 1,
        v: 0
      },
      {
        type: "crystal",
        x: 4161,
        s: 0.77,
        v: 1
      },
      {
        type: "crystal",
        x: 4562,
        s: 0.94,
        v: 0
      },
      {
        type: "crystal",
        x: 5260,
        s: 0.88,
        v: 1
      },
      {
        type: "pine",
        x: 5894,
        s: 0.8,
        v: 2
      },
      {
        type: "crystal",
        x: 6291,
        s: 0.98,
        v: 2
      },
      {
        type: "pine",
        x: 6831,
        s: 1.08,
        v: 1
      },
      {
        type: "crystal",
        x: 7375,
        s: 1.01,
        v: 2
      },
      {
        type: "crystal",
        x: 7830,
        s: 1.01,
        v: 0
      },
      {
        type: "crystal",
        x: 8373,
        s: 0.79,
        v: 2
      },
      {
        type: "crystal",
        x: 8802,
        s: 1.02,
        v: 1
      },
      {
        type: "crystal",
        x: 9326,
        s: 0.82,
        v: 0
      },
      {
        type: "crystal",
        x: 9832,
        s: 0.78,
        v: 1
      },
      {
        type: "pine",
        x: 10559,
        s: 0.88,
        v: 1
      },
      {
        type: "crystal",
        x: 11218,
        s: 1.03,
        v: 0
      },
      {
        type: "crystal",
        x: 11760,
        s: 0.87,
        v: 2
      },
      {
        type: "crystal",
        x: 12469,
        s: 0.99,
        v: 2
      },
      {
        type: "crystal",
        x: 12889,
        s: 0.81,
        v: 0
      },
      {
        type: "crystal",
        x: 13436,
        s: 1.07,
        v: 1
      },
      {
        type: "pine",
        x: 14002,
        s: 0.81,
        v: 1
      },
      {
        type: "crystal",
        x: 14546,
        s: 0.81,
        v: 1
      },
      {
        type: "crystal",
        x: 15294,
        s: 0.83,
        v: 1
      },
      {
        type: "pine",
        x: 15974,
        s: 1,
        v: 0
      },
      {
        type: "pine",
        x: 16484,
        s: 0.86,
        v: 2
      },
      {
        type: "crystal",
        x: 16885,
        s: 1.03,
        v: 1
      },
      {
        type: "pine",
        x: 17524,
        s: 1.04,
        v: 0
      },
      {
        type: "pine",
        x: 18073,
        s: 0.94,
        v: 2
      },
      {
        type: "crystal",
        x: 18771,
        s: 0.95,
        v: 2
      },
      {
        type: "crystal",
        x: 19309,
        s: 0.91,
        v: 1
      },
      {
        type: "pine",
        x: 19733,
        s: 0.76,
        v: 1
      },
      {
        type: "crystal",
        x: 20368,
        s: 1.04,
        v: 2
      },
      {
        type: "crystal",
        x: 20872,
        s: 0.81,
        v: 2
      },
      {
        type: "crystal",
        x: 21322,
        s: 1.07,
        v: 1
      },
      {
        type: "crystal",
        x: 21747,
        s: 0.92,
        v: 1
      },
      {
        type: "crystal",
        x: 22380,
        s: 0.92,
        v: 1
      },
      {
        type: "crystal",
        x: 23101,
        s: 0.85,
        v: 2
      },
      {
        type: "pine",
        x: 23510,
        s: 0.82,
        v: 2
      },
      {
        type: "pine",
        x: 24143,
        s: 0.86,
        v: 0
      },
      {
        type: "crystal",
        x: 24631,
        s: 0.91,
        v: 1
      },
      {
        type: "crystal",
        x: 25063,
        s: 0.92,
        v: 2
      },
      {
        type: "crystal",
        x: 25632,
        s: 0.85,
        v: 2
      },
      {
        type: "crystal",
        x: 26137,
        s: 1.06,
        v: 0
      },
      {
        type: "crystal",
        x: 26664,
        s: 0.76,
        v: 1
      },
      {
        type: "pine",
        x: 27156,
        s: 0.94,
        v: 1
      },
      {
        type: "crystal",
        x: 27635,
        s: 1,
        v: 2
      },
      {
        type: "pine",
        x: 28387,
        s: 0.96,
        v: 0
      },
      {
        type: "crystal",
        x: 29022,
        s: 0.83,
        v: 0
      },
      {
        type: "crystal",
        x: 29533,
        s: 1.01,
        v: 1
      },
      {
        type: "pine",
        x: 29947,
        s: 0.96,
        v: 1
      },
      {
        type: "pine",
        x: 30441,
        s: 1.02,
        v: 1
      },
      {
        type: "pine",
        x: 30879,
        s: 0.77,
        v: 1
      },
      {
        type: "crystal",
        x: 31378,
        s: 0.78,
        v: 1
      },
      {
        type: "snowman",
        x: 14531,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 32252
      }
    ]
  };

  // src/data/levels/island08.json
  var island08_default = {
    id: "island08",
    name: {
      ko: "\uAD6C\uB984 \uC704 \uD558\uB298",
      en: "Above the Clouds"
    },
    biome: "cloud",
    surface: "cloud",
    intro: "cloud",
    points: [
      [
        0,
        600
      ],
      [
        787,
        -208
      ],
      [
        1543,
        261
      ],
      [
        2252,
        -197
      ],
      [
        2935,
        212
      ],
      [
        3681,
        -230
      ],
      [
        4467,
        233
      ],
      [
        5256,
        -207
      ],
      [
        6034,
        219
      ],
      [
        6813,
        -232
      ],
      [
        7566,
        212
      ],
      [
        8278,
        -263
      ],
      [
        8997,
        197
      ],
      [
        9347,
        -175
      ],
      [
        9666,
        35
      ],
      [
        9968,
        -190
      ],
      [
        10261,
        7
      ],
      [
        10618,
        -177
      ],
      [
        10970,
        -2
      ],
      [
        11745,
        -350
      ],
      [
        12475,
        122
      ],
      [
        13232,
        -296
      ],
      [
        13943,
        87
      ],
      [
        14657,
        -303
      ],
      [
        15411,
        130
      ],
      [
        16185,
        -275
      ],
      [
        16887,
        130
      ],
      [
        17688,
        -294
      ],
      [
        18497,
        129
      ],
      [
        19377,
        -424
      ],
      [
        20256,
        333
      ],
      [
        21136,
        -447
      ],
      [
        21961,
        292
      ],
      [
        22685,
        -272
      ],
      [
        23398,
        181
      ],
      [
        24179,
        -208
      ],
      [
        24954,
        187
      ],
      [
        25706,
        -214
      ],
      [
        26451,
        229
      ],
      [
        27185,
        -239
      ],
      [
        27897,
        195
      ],
      [
        28700,
        -190
      ],
      [
        29474,
        221
      ],
      [
        30800,
        -448
      ],
      [
        32013,
        529
      ],
      [
        32725,
        -203
      ],
      [
        33394,
        239
      ],
      [
        34160,
        -175
      ],
      [
        34937,
        280
      ],
      [
        35657,
        -194
      ],
      [
        36402,
        241
      ],
      [
        37042,
        -200
      ],
      [
        37862,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 1450,
        y: 403
      },
      {
        type: "single",
        x: 1546,
        y: 530
      },
      {
        type: "single",
        x: 1642,
        y: 653
      },
      {
        type: "single",
        x: 1738,
        y: 771
      },
      {
        type: "single",
        x: 1833,
        y: 885
      },
      {
        type: "single",
        x: 1928,
        y: 994
      },
      {
        type: "single",
        x: 2022,
        y: 1100
      },
      {
        type: "single",
        x: 3038,
        y: 1809
      },
      {
        type: "single",
        x: 3129,
        y: 1810
      },
      {
        type: "single",
        x: 3219,
        y: 1801
      },
      {
        type: "single",
        x: 3310,
        y: 1787
      },
      {
        type: "single",
        x: 3400,
        y: 1771
      },
      {
        type: "single",
        x: 3489,
        y: 1746
      },
      {
        type: "single",
        x: 3579,
        y: 1710
      },
      {
        type: "single",
        x: 4629,
        y: 553
      },
      {
        type: "single",
        x: 4714,
        y: 427
      },
      {
        type: "single",
        x: 4799,
        y: 299
      },
      {
        type: "single",
        x: 4884,
        y: 168
      },
      {
        type: "single",
        x: 4968,
        y: 36
      },
      {
        type: "single",
        x: 6072,
        y: 525
      },
      {
        type: "single",
        x: 6189,
        y: 662
      },
      {
        type: "single",
        x: 6305,
        y: 795
      },
      {
        type: "single",
        x: 6421,
        y: 924
      },
      {
        type: "single",
        x: 6536,
        y: 1048
      },
      {
        type: "single",
        x: 6651,
        y: 1168
      },
      {
        type: "single",
        x: 6765,
        y: 1279
      },
      {
        type: "single",
        x: 7864,
        y: 1952
      },
      {
        type: "single",
        x: 7974,
        y: 1991
      },
      {
        type: "single",
        x: 8083,
        y: 2027
      },
      {
        type: "single",
        x: 8192,
        y: 2055
      },
      {
        type: "single",
        x: 8301,
        y: 2072
      },
      {
        type: "single",
        x: 8409,
        y: 2077
      },
      {
        type: "single",
        x: 8517,
        y: 2072
      },
      {
        type: "single",
        x: 9577,
        y: 1795
      },
      {
        type: "single",
        x: 9681,
        y: 1740
      },
      {
        type: "single",
        x: 9785,
        y: 1675
      },
      {
        type: "single",
        x: 9888,
        y: 1598
      },
      {
        type: "single",
        x: 9991,
        y: 1511
      },
      {
        type: "single",
        x: 10094,
        y: 1413
      },
      {
        type: "single",
        x: 10196,
        y: 1305
      },
      {
        type: "single",
        x: 12337,
        y: 213
      },
      {
        type: "single",
        x: 12476,
        y: 410
      },
      {
        type: "single",
        x: 12613,
        y: 595
      },
      {
        type: "single",
        x: 12750,
        y: 767
      },
      {
        type: "single",
        x: 12885,
        y: 927
      },
      {
        type: "single",
        x: 13020,
        y: 1075
      },
      {
        type: "single",
        x: 13155,
        y: 1210
      },
      {
        type: "single",
        x: 14205,
        y: 1875
      },
      {
        type: "single",
        x: 14334,
        y: 1916
      },
      {
        type: "single",
        x: 14462,
        y: 1952
      },
      {
        type: "single",
        x: 14590,
        y: 1976
      },
      {
        type: "single",
        x: 14718,
        y: 1989
      },
      {
        type: "single",
        x: 14845,
        y: 1991
      },
      {
        type: "single",
        x: 14971,
        y: 1981
      },
      {
        type: "single",
        x: 16087,
        y: 1398
      },
      {
        type: "single",
        x: 16209,
        y: 1279
      },
      {
        type: "single",
        x: 16329,
        y: 1149
      },
      {
        type: "single",
        x: 16449,
        y: 1009
      },
      {
        type: "single",
        x: 16569,
        y: 859
      },
      {
        type: "single",
        x: 16688,
        y: 705
      },
      {
        type: "single",
        x: 16806,
        y: 549
      },
      {
        type: "single",
        x: 17833,
        y: 19
      },
      {
        type: "single",
        x: 17977,
        y: 71
      },
      {
        type: "single",
        x: 18120,
        y: 115
      },
      {
        type: "single",
        x: 18263,
        y: 155
      },
      {
        type: "single",
        x: 19386,
        y: 338
      },
      {
        type: "single",
        x: 19524,
        y: 343
      },
      {
        type: "single",
        x: 19661,
        y: 345
      },
      {
        type: "single",
        x: 19798,
        y: 344
      },
      {
        type: "single",
        x: 19934,
        y: 339
      },
      {
        type: "single",
        x: 20069,
        y: 333
      },
      {
        type: "single",
        x: 21209,
        y: 719
      },
      {
        type: "single",
        x: 21353,
        y: 761
      },
      {
        type: "single",
        x: 21497,
        y: 799
      },
      {
        type: "single",
        x: 21640,
        y: 832
      },
      {
        type: "single",
        x: 21783,
        y: 861
      },
      {
        type: "single",
        x: 21925,
        y: 880
      },
      {
        type: "single",
        x: 22066,
        y: 887
      },
      {
        type: "single",
        x: 23176,
        y: 544
      },
      {
        type: "single",
        x: 23313,
        y: 451
      },
      {
        type: "single",
        x: 23448,
        y: 348
      },
      {
        type: "single",
        x: 23583,
        y: 234
      },
      {
        type: "single",
        x: 24598,
        y: 154
      },
      {
        type: "single",
        x: 24749,
        y: 212
      },
      {
        type: "single",
        x: 24900,
        y: 266
      },
      {
        type: "single",
        x: 25050,
        y: 317
      },
      {
        type: "single",
        x: 25224,
        y: 368
      },
      {
        type: "single",
        x: 25372,
        y: 400
      },
      {
        type: "single",
        x: 25520,
        y: 422
      },
      {
        type: "single",
        x: 26536,
        y: 470
      },
      {
        type: "single",
        x: 26679,
        y: 464
      },
      {
        type: "single",
        x: 26822,
        y: 455
      },
      {
        type: "single",
        x: 26963,
        y: 444
      },
      {
        type: "single",
        x: 27104,
        y: 430
      },
      {
        type: "single",
        x: 27245,
        y: 413
      },
      {
        type: "single",
        x: 27385,
        y: 392
      },
      {
        type: "single",
        x: 29384,
        y: 336
      },
      {
        type: "single",
        x: 29463,
        y: 420
      },
      {
        type: "single",
        x: 29542,
        y: 500
      },
      {
        type: "single",
        x: 29620,
        y: 577
      },
      {
        type: "single",
        x: 29698,
        y: 649
      },
      {
        type: "single",
        x: 29776,
        y: 717
      },
      {
        type: "single",
        x: 29854,
        y: 782
      },
      {
        type: "single",
        x: 30920,
        y: 1277
      },
      {
        type: "single",
        x: 30995,
        y: 1284
      },
      {
        type: "single",
        x: 31070,
        y: 1287
      },
      {
        type: "single",
        x: 31144,
        y: 1286
      },
      {
        type: "single",
        x: 31219,
        y: 1283
      },
      {
        type: "single",
        x: 31293,
        y: 1277
      },
      {
        type: "single",
        x: 31367,
        y: 1269
      },
      {
        type: "single",
        x: 32639,
        y: 94
      },
      {
        type: "single",
        x: 32736,
        y: 167
      },
      {
        type: "single",
        x: 32833,
        y: 242
      },
      {
        type: "single",
        x: 32929,
        y: 316
      },
      {
        type: "single",
        x: 33026,
        y: 388
      },
      {
        type: "single",
        x: 33121,
        y: 456
      },
      {
        type: "single",
        x: 33217,
        y: 519
      },
      {
        type: "single",
        x: 34248,
        y: 907
      },
      {
        type: "single",
        x: 34341,
        y: 892
      },
      {
        type: "single",
        x: 34433,
        y: 866
      },
      {
        type: "single",
        x: 34524,
        y: 829
      },
      {
        type: "single",
        x: 34616,
        y: 780
      },
      {
        type: "single",
        x: 34707,
        y: 720
      },
      {
        type: "single",
        x: 34798,
        y: 650
      },
      {
        type: "single",
        x: 36310,
        y: 388
      },
      {
        type: "single",
        x: 36458,
        y: 582
      },
      {
        type: "single",
        x: 36605,
        y: 771
      },
      {
        type: "single",
        x: 36751,
        y: 955
      },
      {
        type: "single",
        x: 36896,
        y: 1134
      },
      {
        type: "single",
        x: 37039,
        y: 1308
      },
      {
        type: "single",
        x: 37182,
        y: 1478
      },
      {
        type: "single",
        x: 2511,
        y: 1627
      },
      {
        type: "single",
        x: 2609,
        y: 1707
      },
      {
        type: "single",
        x: 2707,
        y: 1782
      },
      {
        type: "single",
        x: 2804,
        y: 1847
      },
      {
        type: "single",
        x: 2901,
        y: 1902
      },
      {
        type: "single",
        x: 2998,
        y: 1949
      },
      {
        type: "single",
        x: 3095,
        y: 1993
      },
      {
        type: "single",
        x: 5252,
        y: 1952
      },
      {
        type: "single",
        x: 5342,
        y: 1887
      },
      {
        type: "single",
        x: 5433,
        y: 1811
      },
      {
        type: "single",
        x: 5523,
        y: 1723
      },
      {
        type: "single",
        x: 5614,
        y: 1625
      },
      {
        type: "single",
        x: 5703,
        y: 1516
      },
      {
        type: "single",
        x: 5793,
        y: 1397
      },
      {
        type: "single",
        x: 7407,
        y: 278
      },
      {
        type: "single",
        x: 7542,
        y: 462
      },
      {
        type: "single",
        x: 7677,
        y: 642
      },
      {
        type: "single",
        x: 7810,
        y: 817
      },
      {
        type: "single",
        x: 7943,
        y: 987
      },
      {
        type: "single",
        x: 8074,
        y: 1153
      },
      {
        type: "single",
        x: 8206,
        y: 1314
      },
      {
        type: "single",
        x: 10473,
        y: 2470
      },
      {
        type: "single",
        x: 10595,
        y: 2438
      },
      {
        type: "single",
        x: 10716,
        y: 2395
      },
      {
        type: "single",
        x: 10837,
        y: 2341
      },
      {
        type: "single",
        x: 10958,
        y: 2275
      },
      {
        type: "single",
        x: 11078,
        y: 2200
      },
      {
        type: "single",
        x: 11198,
        y: 2122
      },
      {
        type: "single",
        x: 13822,
        y: 186
      },
      {
        type: "single",
        x: 13993,
        y: 405
      },
      {
        type: "single",
        x: 14162,
        y: 618
      },
      {
        type: "single",
        x: 14330,
        y: 826
      },
      {
        type: "single",
        x: 14497,
        y: 1022
      },
      {
        type: "single",
        x: 14663,
        y: 1207
      },
      {
        type: "single",
        x: 14828,
        y: 1383
      },
      {
        type: "single",
        x: 17192,
        y: 3442
      },
      {
        type: "single",
        x: 17343,
        y: 3519
      },
      {
        type: "single",
        x: 17494,
        y: 3585
      },
      {
        type: "single",
        x: 17644,
        y: 3639
      },
      {
        type: "single",
        x: 17793,
        y: 3682
      },
      {
        type: "single",
        x: 17942,
        y: 3713
      },
      {
        type: "single",
        x: 18090,
        y: 3733
      },
      {
        type: "single",
        x: 20384,
        y: 3006
      },
      {
        type: "single",
        x: 20522,
        y: 2892
      },
      {
        type: "single",
        x: 20660,
        y: 2771
      },
      {
        type: "single",
        x: 20797,
        y: 2639
      },
      {
        type: "single",
        x: 20933,
        y: 2500
      },
      {
        type: "single",
        x: 21069,
        y: 2360
      },
      {
        type: "single",
        x: 21204,
        y: 2216
      },
      {
        type: "single",
        x: 23996,
        y: -5
      },
      {
        type: "single",
        x: 24119,
        y: 122
      },
      {
        type: "single",
        x: 24241,
        y: 234
      },
      {
        type: "single",
        x: 24362,
        y: 329
      },
      {
        type: "single",
        x: 24483,
        y: 405
      },
      {
        type: "single",
        x: 24603,
        y: 437
      },
      {
        type: "single",
        x: 24723,
        y: 425
      },
      {
        type: "single",
        x: 27678,
        y: 1527
      },
      {
        type: "single",
        x: 27770,
        y: 1578
      },
      {
        type: "single",
        x: 27861,
        y: 1626
      },
      {
        type: "single",
        x: 27952,
        y: 1670
      },
      {
        type: "single",
        x: 28042,
        y: 1710
      },
      {
        type: "single",
        x: 28133,
        y: 1746
      },
      {
        type: "single",
        x: 28223,
        y: 1779
      },
      {
        type: "single",
        x: 30149,
        y: 455
      },
      {
        type: "single",
        x: 30233,
        y: 301
      },
      {
        type: "single",
        x: 30316,
        y: 145
      },
      {
        type: "single",
        x: 30400,
        y: -12
      },
      {
        type: "single",
        x: 30483,
        y: -171
      },
      {
        type: "single",
        x: 32121,
        y: 1083
      },
      {
        type: "single",
        x: 32204,
        y: 1186
      },
      {
        type: "single",
        x: 32286,
        y: 1284
      },
      {
        type: "single",
        x: 32368,
        y: 1378
      },
      {
        type: "single",
        x: 32450,
        y: 1468
      },
      {
        type: "single",
        x: 32531,
        y: 1554
      },
      {
        type: "single",
        x: 32612,
        y: 1636
      },
      {
        type: "single",
        x: 35103,
        y: 924
      },
      {
        type: "single",
        x: 35177,
        y: 757
      },
      {
        type: "single",
        x: 35251,
        y: 578
      },
      {
        type: "single",
        x: 35324,
        y: 394
      },
      {
        type: "single",
        x: 35397,
        y: 208
      },
      {
        type: "single",
        x: 35469,
        y: 21
      },
      {
        type: "ground",
        x: 7686,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 11090,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 12595,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 22081,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 23518,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 25074,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 26571,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "arc",
        x: 22041,
        y: 1392,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 20336,
        y: 1433,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 32093,
        y: 1629,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      }
    ],
    blizzard: {
      startGap: 1350,
      speed: 980,
      accel: 9
    },
    expect: {
      upgrades: {
        flap: 7,
        slide: 6,
        magnet: 4,
        glide: 4,
        scarf: 2
      }
    },
    goals: [
      {
        type: "perfect",
        n: 12
      },
      {
        type: "height",
        n: 300
      }
    ],
    ice: [],
    wind: [
      {
        x: 9808,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 14497,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 17528,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 32565,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 35497,
        w: 320,
        h: 1500,
        power: 1
      }
    ],
    geysers: [
      {
        x: 15968
      },
      {
        x: 17464
      },
      {
        x: 20890
      },
      {
        x: 23960
      },
      {
        x: 26979
      },
      {
        x: 32526
      },
      {
        x: 33946
      }
    ],
    rings: [],
    decor: [
      {
        type: "sign",
        x: 340
      },
      {
        type: "balloon",
        x: 700,
        s: 1.04,
        v: 2
      },
      {
        type: "balloon",
        x: 1279,
        s: 0.89,
        v: 0
      },
      {
        type: "balloon",
        x: 1736,
        s: 0.92,
        v: 2
      },
      {
        type: "balloon",
        x: 2368,
        s: 0.88,
        v: 2
      },
      {
        type: "balloon",
        x: 3073,
        s: 0.94,
        v: 1
      },
      {
        type: "star",
        x: 3757,
        s: 0.82,
        v: 2
      },
      {
        type: "balloon",
        x: 4214,
        s: 0.82,
        v: 1
      },
      {
        type: "balloon",
        x: 4896,
        s: 0.82,
        v: 0
      },
      {
        type: "star",
        x: 5411,
        s: 1.01,
        v: 1
      },
      {
        type: "star",
        x: 6101,
        s: 1.05,
        v: 1
      },
      {
        type: "balloon",
        x: 6525,
        s: 0.79,
        v: 2
      },
      {
        type: "balloon",
        x: 6966,
        s: 0.96,
        v: 2
      },
      {
        type: "balloon",
        x: 7378,
        s: 0.79,
        v: 2
      },
      {
        type: "balloon",
        x: 7886,
        s: 1.07,
        v: 2
      },
      {
        type: "balloon",
        x: 8421,
        s: 0.76,
        v: 1
      },
      {
        type: "balloon",
        x: 9143,
        s: 1.1,
        v: 1
      },
      {
        type: "balloon",
        x: 9611,
        s: 1.09,
        v: 2
      },
      {
        type: "balloon",
        x: 10284,
        s: 0.78,
        v: 1
      },
      {
        type: "star",
        x: 10963,
        s: 0.91,
        v: 1
      },
      {
        type: "balloon",
        x: 11418,
        s: 1,
        v: 0
      },
      {
        type: "star",
        x: 11916,
        s: 0.95,
        v: 0
      },
      {
        type: "balloon",
        x: 12523,
        s: 0.91,
        v: 0
      },
      {
        type: "star",
        x: 13009,
        s: 1.09,
        v: 2
      },
      {
        type: "balloon",
        x: 13689,
        s: 0.94,
        v: 0
      },
      {
        type: "balloon",
        x: 14148,
        s: 0.93,
        v: 2
      },
      {
        type: "balloon",
        x: 14843,
        s: 0.93,
        v: 2
      },
      {
        type: "balloon",
        x: 15512,
        s: 0.76,
        v: 2
      },
      {
        type: "balloon",
        x: 16084,
        s: 1.01,
        v: 2
      },
      {
        type: "balloon",
        x: 16574,
        s: 0.83,
        v: 1
      },
      {
        type: "balloon",
        x: 16983,
        s: 0.84,
        v: 2
      },
      {
        type: "star",
        x: 17393,
        s: 0.96,
        v: 1
      },
      {
        type: "balloon",
        x: 17861,
        s: 0.79,
        v: 0
      },
      {
        type: "balloon",
        x: 18338,
        s: 0.85,
        v: 0
      },
      {
        type: "balloon",
        x: 18942,
        s: 0.84,
        v: 1
      },
      {
        type: "balloon",
        x: 19334,
        s: 0.87,
        v: 0
      },
      {
        type: "balloon",
        x: 20051,
        s: 0.93,
        v: 0
      },
      {
        type: "star",
        x: 20569,
        s: 1.03,
        v: 1
      },
      {
        type: "star",
        x: 21078,
        s: 0.91,
        v: 0
      },
      {
        type: "star",
        x: 21535,
        s: 0.91,
        v: 0
      },
      {
        type: "balloon",
        x: 22087,
        s: 1.04,
        v: 2
      },
      {
        type: "star",
        x: 22549,
        s: 1.03,
        v: 0
      },
      {
        type: "balloon",
        x: 23099,
        s: 0.98,
        v: 2
      },
      {
        type: "balloon",
        x: 23822,
        s: 0.83,
        v: 0
      },
      {
        type: "balloon",
        x: 24287,
        s: 0.91,
        v: 0
      },
      {
        type: "balloon",
        x: 24833,
        s: 1.05,
        v: 2
      },
      {
        type: "balloon",
        x: 25398,
        s: 0.76,
        v: 1
      },
      {
        type: "balloon",
        x: 26044,
        s: 1.06,
        v: 0
      },
      {
        type: "balloon",
        x: 26468,
        s: 1.07,
        v: 1
      },
      {
        type: "star",
        x: 27139,
        s: 1.09,
        v: 2
      },
      {
        type: "balloon",
        x: 27747,
        s: 1.02,
        v: 2
      },
      {
        type: "star",
        x: 28387,
        s: 0.82,
        v: 1
      },
      {
        type: "balloon",
        x: 28875,
        s: 1.05,
        v: 2
      },
      {
        type: "star",
        x: 29291,
        s: 0.76,
        v: 1
      },
      {
        type: "balloon",
        x: 29730,
        s: 0.96,
        v: 2
      },
      {
        type: "balloon",
        x: 30437,
        s: 0.92,
        v: 2
      },
      {
        type: "star",
        x: 31069,
        s: 0.91,
        v: 2
      },
      {
        type: "balloon",
        x: 31708,
        s: 0.88,
        v: 1
      },
      {
        type: "balloon",
        x: 32358,
        s: 0.95,
        v: 0
      },
      {
        type: "balloon",
        x: 33109,
        s: 0.75,
        v: 1
      },
      {
        type: "balloon",
        x: 33718,
        s: 0.96,
        v: 1
      },
      {
        type: "star",
        x: 34212,
        s: 0.78,
        v: 1
      },
      {
        type: "balloon",
        x: 34631,
        s: 0.8,
        v: 0
      },
      {
        type: "balloon",
        x: 35150,
        s: 1.03,
        v: 1
      },
      {
        type: "balloon",
        x: 35791,
        s: 0.88,
        v: 2
      },
      {
        type: "balloon",
        x: 36396,
        s: 0.76,
        v: 0
      },
      {
        type: "balloon",
        x: 37079,
        s: 0.9,
        v: 1
      },
      {
        type: "snowman",
        x: 17038,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 37822
      }
    ]
  };

  // src/data/levels/island09.json
  var island09_default = {
    id: "island09",
    name: {
      ko: "\uD558\uB298 \uB05D",
      en: "Sky's End"
    },
    biome: "stars",
    surface: "snow",
    intro: null,
    points: [
      [
        0,
        520
      ],
      [
        712,
        -364
      ],
      [
        1478,
        293
      ],
      [
        2186,
        -356
      ],
      [
        2922,
        259
      ],
      [
        3611,
        -351
      ],
      [
        4279,
        222
      ],
      [
        4931,
        -407
      ],
      [
        5545,
        214
      ],
      [
        6875,
        -567
      ],
      [
        8106,
        327
      ],
      [
        9372,
        -591
      ],
      [
        10628,
        351
      ],
      [
        10980,
        -200
      ],
      [
        11310,
        -2
      ],
      [
        11665,
        -178
      ],
      [
        12045,
        43
      ],
      [
        12372,
        -196
      ],
      [
        12720,
        -11
      ],
      [
        13666,
        -466
      ],
      [
        14588,
        314
      ],
      [
        15546,
        -442
      ],
      [
        16510,
        349
      ],
      [
        16988,
        147
      ],
      [
        17465,
        459
      ],
      [
        17905,
        257
      ],
      [
        18345,
        569
      ],
      [
        18804,
        400
      ],
      [
        19262,
        679
      ],
      [
        19851,
        -299
      ],
      [
        20457,
        185
      ],
      [
        21088,
        -307
      ],
      [
        21693,
        203
      ],
      [
        22328,
        -269
      ],
      [
        22994,
        173
      ],
      [
        23607,
        -318
      ],
      [
        24264,
        164
      ],
      [
        25171,
        -443
      ],
      [
        26018,
        300
      ],
      [
        26887,
        -504
      ],
      [
        27704,
        316
      ],
      [
        28369,
        -404
      ],
      [
        28974,
        164
      ],
      [
        29687,
        -429
      ],
      [
        30401,
        224
      ],
      [
        31050,
        -373
      ],
      [
        31729,
        204
      ],
      [
        32384,
        -373
      ],
      [
        32980,
        219
      ],
      [
        34372,
        -531
      ],
      [
        35771,
        418
      ],
      [
        37130,
        -581
      ],
      [
        38444,
        396
      ],
      [
        39400,
        -457
      ],
      [
        40343,
        333
      ],
      [
        41219,
        -400
      ],
      [
        42153,
        337
      ],
      [
        42793,
        -200
      ],
      [
        43613,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 1440,
        y: 538
      },
      {
        type: "single",
        x: 1577,
        y: 753
      },
      {
        type: "single",
        x: 1712,
        y: 938
      },
      {
        type: "single",
        x: 1847,
        y: 1076
      },
      {
        type: "single",
        x: 1982,
        y: 1169
      },
      {
        type: "single",
        x: 2115,
        y: 1216
      },
      {
        type: "single",
        x: 2249,
        y: 1226
      },
      {
        type: "single",
        x: 4149,
        y: 299
      },
      {
        type: "single",
        x: 4243,
        y: 469
      },
      {
        type: "single",
        x: 4336,
        y: 634
      },
      {
        type: "single",
        x: 4429,
        y: 794
      },
      {
        type: "single",
        x: 4522,
        y: 950
      },
      {
        type: "single",
        x: 4614,
        y: 1102
      },
      {
        type: "single",
        x: 4706,
        y: 1248
      },
      {
        type: "single",
        x: 5761,
        y: 2658
      },
      {
        type: "single",
        x: 5848,
        y: 2742
      },
      {
        type: "single",
        x: 5935,
        y: 2814
      },
      {
        type: "single",
        x: 6022,
        y: 2875
      },
      {
        type: "single",
        x: 6108,
        y: 2925
      },
      {
        type: "single",
        x: 6194,
        y: 2963
      },
      {
        type: "single",
        x: 6280,
        y: 2990
      },
      {
        type: "single",
        x: 7293,
        y: 2437
      },
      {
        type: "single",
        x: 7376,
        y: 2320
      },
      {
        type: "single",
        x: 7458,
        y: 2197
      },
      {
        type: "single",
        x: 7541,
        y: 2073
      },
      {
        type: "single",
        x: 7622,
        y: 1946
      },
      {
        type: "single",
        x: 7704,
        y: 1818
      },
      {
        type: "single",
        x: 7785,
        y: 1687
      },
      {
        type: "single",
        x: 8843,
        y: 905
      },
      {
        type: "single",
        x: 8937,
        y: 895
      },
      {
        type: "single",
        x: 9032,
        y: 881
      },
      {
        type: "single",
        x: 9126,
        y: 866
      },
      {
        type: "single",
        x: 9220,
        y: 848
      },
      {
        type: "single",
        x: 9313,
        y: 827
      },
      {
        type: "single",
        x: 9407,
        y: 804
      },
      {
        type: "single",
        x: 10779,
        y: 322
      },
      {
        type: "single",
        x: 10856,
        y: 286
      },
      {
        type: "single",
        x: 10934,
        y: 226
      },
      {
        type: "single",
        x: 11011,
        y: 133
      },
      {
        type: "single",
        x: 11088,
        y: 30
      },
      {
        type: "single",
        x: 12116,
        y: 206
      },
      {
        type: "single",
        x: 12205,
        y: 278
      },
      {
        type: "single",
        x: 12293,
        y: 334
      },
      {
        type: "single",
        x: 12382,
        y: 375
      },
      {
        type: "single",
        x: 12470,
        y: 401
      },
      {
        type: "single",
        x: 12557,
        y: 395
      },
      {
        type: "single",
        x: 12645,
        y: 344
      },
      {
        type: "single",
        x: 14516,
        y: 456
      },
      {
        type: "single",
        x: 14625,
        y: 567
      },
      {
        type: "single",
        x: 14733,
        y: 662
      },
      {
        type: "single",
        x: 14840,
        y: 741
      },
      {
        type: "single",
        x: 14947,
        y: 806
      },
      {
        type: "single",
        x: 15054,
        y: 855
      },
      {
        type: "single",
        x: 15160,
        y: 889
      },
      {
        type: "single",
        x: 17498,
        y: 595
      },
      {
        type: "single",
        x: 17580,
        y: 662
      },
      {
        type: "single",
        x: 17661,
        y: 714
      },
      {
        type: "single",
        x: 17742,
        y: 751
      },
      {
        type: "single",
        x: 17823,
        y: 783
      },
      {
        type: "single",
        x: 17904,
        y: 825
      },
      {
        type: "single",
        x: 17984,
        y: 879
      },
      {
        type: "single",
        x: 20415,
        y: 386
      },
      {
        type: "single",
        x: 20514,
        y: 555
      },
      {
        type: "single",
        x: 20614,
        y: 719
      },
      {
        type: "single",
        x: 20712,
        y: 878
      },
      {
        type: "single",
        x: 20811,
        y: 1033
      },
      {
        type: "single",
        x: 20909,
        y: 1183
      },
      {
        type: "single",
        x: 21006,
        y: 1329
      },
      {
        type: "single",
        x: 22049,
        y: 2567
      },
      {
        type: "single",
        x: 22142,
        y: 2624
      },
      {
        type: "single",
        x: 22234,
        y: 2669
      },
      {
        type: "single",
        x: 22327,
        y: 2703
      },
      {
        type: "single",
        x: 22419,
        y: 2725
      },
      {
        type: "single",
        x: 22511,
        y: 2736
      },
      {
        type: "single",
        x: 22602,
        y: 2736
      },
      {
        type: "single",
        x: 23681,
        y: 2028
      },
      {
        type: "single",
        x: 23769,
        y: 1903
      },
      {
        type: "single",
        x: 23857,
        y: 1767
      },
      {
        type: "single",
        x: 23944,
        y: 1621
      },
      {
        type: "single",
        x: 24031,
        y: 1466
      },
      {
        type: "single",
        x: 24117,
        y: 1309
      },
      {
        type: "single",
        x: 24203,
        y: 1150
      },
      {
        type: "single",
        x: 25874,
        y: 441
      },
      {
        type: "single",
        x: 25986,
        y: 649
      },
      {
        type: "single",
        x: 26098,
        y: 851
      },
      {
        type: "single",
        x: 26208,
        y: 1049
      },
      {
        type: "single",
        x: 26319,
        y: 1241
      },
      {
        type: "single",
        x: 26428,
        y: 1429
      },
      {
        type: "single",
        x: 26537,
        y: 1611
      },
      {
        type: "single",
        x: 27598,
        y: 2818
      },
      {
        type: "single",
        x: 27702,
        y: 2874
      },
      {
        type: "single",
        x: 27805,
        y: 2920
      },
      {
        type: "single",
        x: 27909,
        y: 2953
      },
      {
        type: "single",
        x: 28011,
        y: 2976
      },
      {
        type: "single",
        x: 28114,
        y: 2987
      },
      {
        type: "single",
        x: 28216,
        y: 2990
      },
      {
        type: "single",
        x: 29224,
        y: 2684
      },
      {
        type: "single",
        x: 29323,
        y: 2602
      },
      {
        type: "single",
        x: 29421,
        y: 2518
      },
      {
        type: "single",
        x: 29520,
        y: 2428
      },
      {
        type: "single",
        x: 29618,
        y: 2328
      },
      {
        type: "single",
        x: 29715,
        y: 2219
      },
      {
        type: "single",
        x: 29812,
        y: 2107
      },
      {
        type: "single",
        x: 30855,
        y: 743
      },
      {
        type: "single",
        x: 30947,
        y: 608
      },
      {
        type: "single",
        x: 31039,
        y: 476
      },
      {
        type: "single",
        x: 31131,
        y: 348
      },
      {
        type: "single",
        x: 31222,
        y: 225
      },
      {
        type: "single",
        x: 31313,
        y: 104
      },
      {
        type: "single",
        x: 32323,
        y: -24
      },
      {
        type: "single",
        x: 32436,
        y: 91
      },
      {
        type: "single",
        x: 32548,
        y: 191
      },
      {
        type: "single",
        x: 32660,
        y: 273
      },
      {
        type: "single",
        x: 32772,
        y: 317
      },
      {
        type: "single",
        x: 32884,
        y: 317
      },
      {
        type: "single",
        x: 38163,
        y: 451
      },
      {
        type: "single",
        x: 38252,
        y: 585
      },
      {
        type: "single",
        x: 38340,
        y: 714
      },
      {
        type: "single",
        x: 38428,
        y: 839
      },
      {
        type: "single",
        x: 38516,
        y: 960
      },
      {
        type: "single",
        x: 38603,
        y: 1077
      },
      {
        type: "single",
        x: 38690,
        y: 1190
      },
      {
        type: "single",
        x: 39711,
        y: 2221
      },
      {
        type: "single",
        x: 39794,
        y: 2281
      },
      {
        type: "single",
        x: 39877,
        y: 2337
      },
      {
        type: "single",
        x: 39960,
        y: 2389
      },
      {
        type: "single",
        x: 40043,
        y: 2438
      },
      {
        type: "single",
        x: 40125,
        y: 2482
      },
      {
        type: "single",
        x: 40207,
        y: 2523
      },
      {
        type: "single",
        x: 41259,
        y: 2709
      },
      {
        type: "single",
        x: 41339,
        y: 2700
      },
      {
        type: "single",
        x: 41419,
        y: 2689
      },
      {
        type: "single",
        x: 41498,
        y: 2675
      },
      {
        type: "single",
        x: 41577,
        y: 2659
      },
      {
        type: "single",
        x: 41656,
        y: 2640
      },
      {
        type: "single",
        x: 41735,
        y: 2619
      },
      {
        type: "single",
        x: 2520,
        y: 1241
      },
      {
        type: "single",
        x: 2595,
        y: 1239
      },
      {
        type: "single",
        x: 2670,
        y: 1234
      },
      {
        type: "single",
        x: 2745,
        y: 1227
      },
      {
        type: "single",
        x: 2819,
        y: 1218
      },
      {
        type: "single",
        x: 2894,
        y: 1207
      },
      {
        type: "single",
        x: 2968,
        y: 1193
      },
      {
        type: "single",
        x: 5442,
        y: 334
      },
      {
        type: "single",
        x: 5549,
        y: 564
      },
      {
        type: "single",
        x: 5656,
        y: 788
      },
      {
        type: "single",
        x: 5763,
        y: 1008
      },
      {
        type: "single",
        x: 5868,
        y: 1222
      },
      {
        type: "single",
        x: 5956,
        y: 1397
      },
      {
        type: "single",
        x: 6060,
        y: 1602
      },
      {
        type: "single",
        x: 8140,
        y: 4646
      },
      {
        type: "single",
        x: 8235,
        y: 4695
      },
      {
        type: "single",
        x: 8330,
        y: 4733
      },
      {
        type: "single",
        x: 8424,
        y: 4760
      },
      {
        type: "single",
        x: 8518,
        y: 4775
      },
      {
        type: "single",
        x: 8612,
        y: 4779
      },
      {
        type: "single",
        x: 8706,
        y: 4772
      },
      {
        type: "single",
        x: 10350,
        y: 3244
      },
      {
        type: "single",
        x: 10438,
        y: 3068
      },
      {
        type: "single",
        x: 10526,
        y: 2881
      },
      {
        type: "single",
        x: 10613,
        y: 2684
      },
      {
        type: "single",
        x: 10700,
        y: 2477
      },
      {
        type: "single",
        x: 10786,
        y: 2260
      },
      {
        type: "single",
        x: 10872,
        y: 2033
      },
      {
        type: "single",
        x: 13034,
        y: 1440
      },
      {
        type: "single",
        x: 13204,
        y: 1637
      },
      {
        type: "single",
        x: 13372,
        y: 1828
      },
      {
        type: "single",
        x: 13539,
        y: 2015
      },
      {
        type: "single",
        x: 13706,
        y: 2196
      },
      {
        type: "single",
        x: 13871,
        y: 2373
      },
      {
        type: "single",
        x: 14035,
        y: 2545
      },
      {
        type: "single",
        x: 15788,
        y: 3758
      },
      {
        type: "single",
        x: 15943,
        y: 3823
      },
      {
        type: "single",
        x: 16098,
        y: 3877
      },
      {
        type: "single",
        x: 16252,
        y: 3919
      },
      {
        type: "single",
        x: 16405,
        y: 3950
      },
      {
        type: "single",
        x: 16557,
        y: 3970
      },
      {
        type: "single",
        x: 16709,
        y: 3978
      },
      {
        type: "single",
        x: 18345,
        y: 3619
      },
      {
        type: "single",
        x: 18490,
        y: 3537
      },
      {
        type: "single",
        x: 18634,
        y: 3453
      },
      {
        type: "single",
        x: 18778,
        y: 3366
      },
      {
        type: "single",
        x: 18922,
        y: 3278
      },
      {
        type: "single",
        x: 19065,
        y: 3187
      },
      {
        type: "single",
        x: 19207,
        y: 3095
      },
      {
        type: "single",
        x: 21266,
        y: 1205
      },
      {
        type: "single",
        x: 21398,
        y: 1009
      },
      {
        type: "single",
        x: 21529,
        y: 803
      },
      {
        type: "single",
        x: 21660,
        y: 588
      },
      {
        type: "single",
        x: 21789,
        y: 369
      },
      {
        type: "single",
        x: 23419,
        y: 1102
      },
      {
        type: "single",
        x: 23577,
        y: 1336
      },
      {
        type: "single",
        x: 23762,
        y: 1601
      },
      {
        type: "single",
        x: 23918,
        y: 1814
      },
      {
        type: "single",
        x: 24074,
        y: 2016
      },
      {
        type: "single",
        x: 24228,
        y: 2213
      },
      {
        type: "single",
        x: 24382,
        y: 2403
      },
      {
        type: "single",
        x: 26875,
        y: 4676
      },
      {
        type: "single",
        x: 27016,
        y: 4752
      },
      {
        type: "single",
        x: 27156,
        y: 4815
      },
      {
        type: "single",
        x: 27295,
        y: 4868
      },
      {
        type: "single",
        x: 27434,
        y: 4909
      },
      {
        type: "single",
        x: 27573,
        y: 4938
      },
      {
        type: "single",
        x: 27711,
        y: 4956
      },
      {
        type: "single",
        x: 30111,
        y: 3567
      },
      {
        type: "single",
        x: 30239,
        y: 3416
      },
      {
        type: "single",
        x: 30366,
        y: 3255
      },
      {
        type: "single",
        x: 30493,
        y: 3083
      },
      {
        type: "single",
        x: 30619,
        y: 2901
      },
      {
        type: "single",
        x: 30744,
        y: 2709
      },
      {
        type: "single",
        x: 30869,
        y: 2507
      },
      {
        type: "single",
        x: 33164,
        y: 678
      },
      {
        type: "single",
        x: 33259,
        y: 826
      },
      {
        type: "single",
        x: 33354,
        y: 969
      },
      {
        type: "single",
        x: 33448,
        y: 1107
      },
      {
        type: "single",
        x: 33543,
        y: 1233
      },
      {
        type: "single",
        x: 33636,
        y: 1349
      },
      {
        type: "single",
        x: 33730,
        y: 1459
      },
      {
        type: "single",
        x: 35368,
        y: 2063
      },
      {
        type: "single",
        x: 35457,
        y: 2019
      },
      {
        type: "single",
        x: 35545,
        y: 1964
      },
      {
        type: "single",
        x: 35634,
        y: 1897
      },
      {
        type: "single",
        x: 35722,
        y: 1820
      },
      {
        type: "single",
        x: 35810,
        y: 1732
      },
      {
        type: "single",
        x: 35898,
        y: 1632
      },
      {
        type: "single",
        x: 38953,
        y: 1609
      },
      {
        type: "single",
        x: 39048,
        y: 1728
      },
      {
        type: "single",
        x: 39142,
        y: 1843
      },
      {
        type: "single",
        x: 39236,
        y: 1954
      },
      {
        type: "single",
        x: 39330,
        y: 2061
      },
      {
        type: "single",
        x: 39423,
        y: 2164
      },
      {
        type: "single",
        x: 39516,
        y: 2263
      },
      {
        type: "single",
        x: 42020,
        y: 3437
      },
      {
        type: "single",
        x: 42106,
        y: 3429
      },
      {
        type: "single",
        x: 42193,
        y: 3418
      },
      {
        type: "single",
        x: 42279,
        y: 3405
      },
      {
        type: "single",
        x: 42365,
        y: 3389
      },
      {
        type: "single",
        x: 42450,
        y: 3371
      },
      {
        type: "single",
        x: 42536,
        y: 3351
      },
      {
        type: "ground",
        x: 120,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "ground",
        x: 35891,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "arc",
        x: 4359,
        y: 1422,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 42233,
        y: 1537,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 38524,
        y: 1596,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "arc",
        x: 40423,
        y: 1533,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      }
    ],
    blizzard: {
      startGap: 1400,
      speed: 1050,
      accel: 10
    },
    expect: {
      upgrades: {
        flap: 8,
        slide: 7,
        magnet: 5,
        glide: 5,
        scarf: 3
      }
    },
    goals: [
      {
        type: "fish",
        n: 300
      },
      {
        type: "fever",
        n: 3
      }
    ],
    ice: [
      [
        14648,
        15586
      ],
      [
        24324,
        25211
      ],
      [
        38504,
        39440
      ]
    ],
    wind: [
      {
        x: 6715,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 17745,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 26727,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 30890,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 36970,
        w: 320,
        h: 1500,
        power: 1
      }
    ],
    geysers: [
      {
        x: 12280
      },
      {
        x: 26644
      },
      {
        x: 32201
      },
      {
        x: 33982
      }
    ],
    rings: [
      {
        x: 3211,
        y: 2566,
        r: 100
      },
      {
        x: 5008,
        y: 1404,
        r: 100
      },
      {
        x: 8324,
        y: 920,
        r: 100
      },
      {
        x: 10140,
        y: 2005,
        r: 100
      },
      {
        x: 12060,
        y: 648,
        r: 100
      },
      {
        x: 14186,
        y: 1474,
        r: 100
      },
      {
        x: 16397,
        y: 1910,
        r: 100
      },
      {
        x: 18106,
        y: 1169,
        r: 100
      },
      {
        x: 20370,
        y: 2010,
        r: 100
      },
      {
        x: 22088,
        y: 2362,
        r: 100
      },
      {
        x: 24924,
        y: 1373,
        r: 100
      },
      {
        x: 26980,
        y: 3361,
        r: 100
      },
      {
        x: 29035,
        y: 2954,
        r: 100
      },
      {
        x: 31945,
        y: 752,
        r: 100
      },
      {
        x: 33995,
        y: 3991,
        r: 100
      },
      {
        x: 36001,
        y: 4962,
        r: 100
      },
      {
        x: 38100,
        y: 2846,
        r: 100
      },
      {
        x: 40540,
        y: 956,
        r: 100
      },
      {
        x: 42341,
        y: 3810,
        r: 100
      }
    ],
    decor: [
      {
        type: "sign",
        x: 340
      },
      {
        type: "crystal",
        x: 700,
        s: 1.02,
        v: 0
      },
      {
        type: "crystal",
        x: 1167,
        s: 0.99,
        v: 2
      },
      {
        type: "crystal",
        x: 1618,
        s: 0.89,
        v: 0
      },
      {
        type: "star",
        x: 2058,
        s: 1,
        v: 0
      },
      {
        type: "crystal",
        x: 2734,
        s: 0.83,
        v: 0
      },
      {
        type: "crystal",
        x: 3236,
        s: 0.81,
        v: 1
      },
      {
        type: "star",
        x: 3674,
        s: 0.97,
        v: 1
      },
      {
        type: "star",
        x: 4431,
        s: 1.09,
        v: 1
      },
      {
        type: "star",
        x: 5053,
        s: 1.02,
        v: 2
      },
      {
        type: "star",
        x: 5454,
        s: 0.85,
        v: 2
      },
      {
        type: "star",
        x: 6072,
        s: 0.94,
        v: 2
      },
      {
        type: "star",
        x: 6828,
        s: 0.8,
        v: 0
      },
      {
        type: "crystal",
        x: 7375,
        s: 0.85,
        v: 1
      },
      {
        type: "crystal",
        x: 7812,
        s: 0.82,
        v: 2
      },
      {
        type: "star",
        x: 8416,
        s: 0.77,
        v: 2
      },
      {
        type: "crystal",
        x: 9039,
        s: 0.8,
        v: 2
      },
      {
        type: "star",
        x: 9504,
        s: 0.92,
        v: 0
      },
      {
        type: "star",
        x: 10066,
        s: 0.97,
        v: 0
      },
      {
        type: "crystal",
        x: 10824,
        s: 0.88,
        v: 2
      },
      {
        type: "crystal",
        x: 11308,
        s: 1.02,
        v: 0
      },
      {
        type: "star",
        x: 11975,
        s: 0.82,
        v: 0
      },
      {
        type: "crystal",
        x: 12553,
        s: 1.01,
        v: 1
      },
      {
        type: "crystal",
        x: 13003,
        s: 0.82,
        v: 2
      },
      {
        type: "star",
        x: 13664,
        s: 0.92,
        v: 2
      },
      {
        type: "star",
        x: 14379,
        s: 0.96,
        v: 0
      },
      {
        type: "star",
        x: 15104,
        s: 1.09,
        v: 0
      },
      {
        type: "crystal",
        x: 15719,
        s: 1.07,
        v: 0
      },
      {
        type: "star",
        x: 16245,
        s: 0.87,
        v: 1
      },
      {
        type: "crystal",
        x: 16803,
        s: 0.8,
        v: 0
      },
      {
        type: "crystal",
        x: 17341,
        s: 0.89,
        v: 0
      },
      {
        type: "crystal",
        x: 17783,
        s: 0.91,
        v: 2
      },
      {
        type: "crystal",
        x: 18193,
        s: 1.03,
        v: 0
      },
      {
        type: "crystal",
        x: 18698,
        s: 1.01,
        v: 2
      },
      {
        type: "crystal",
        x: 19283,
        s: 1.1,
        v: 1
      },
      {
        type: "crystal",
        x: 19677,
        s: 1.06,
        v: 0
      },
      {
        type: "crystal",
        x: 20195,
        s: 1.08,
        v: 1
      },
      {
        type: "star",
        x: 20581,
        s: 0.87,
        v: 1
      },
      {
        type: "crystal",
        x: 21037,
        s: 1.04,
        v: 1
      },
      {
        type: "star",
        x: 21670,
        s: 0.77,
        v: 1
      },
      {
        type: "crystal",
        x: 22232,
        s: 0.78,
        v: 1
      },
      {
        type: "crystal",
        x: 22942,
        s: 1.05,
        v: 1
      },
      {
        type: "star",
        x: 23396,
        s: 1.1,
        v: 2
      },
      {
        type: "crystal",
        x: 23812,
        s: 0.92,
        v: 1
      },
      {
        type: "crystal",
        x: 24511,
        s: 0.94,
        v: 0
      },
      {
        type: "crystal",
        x: 25001,
        s: 0.89,
        v: 0
      },
      {
        type: "crystal",
        x: 25736,
        s: 0.85,
        v: 2
      },
      {
        type: "crystal",
        x: 26232,
        s: 0.79,
        v: 0
      },
      {
        type: "crystal",
        x: 26906,
        s: 0.96,
        v: 2
      },
      {
        type: "star",
        x: 27547,
        s: 0.94,
        v: 1
      },
      {
        type: "crystal",
        x: 28224,
        s: 1.07,
        v: 1
      },
      {
        type: "star",
        x: 28845,
        s: 1.04,
        v: 2
      },
      {
        type: "star",
        x: 29413,
        s: 0.82,
        v: 1
      },
      {
        type: "crystal",
        x: 29989,
        s: 0.9,
        v: 2
      },
      {
        type: "crystal",
        x: 30730,
        s: 0.77,
        v: 0
      },
      {
        type: "star",
        x: 31306,
        s: 0.99,
        v: 2
      },
      {
        type: "crystal",
        x: 31864,
        s: 0.84,
        v: 0
      },
      {
        type: "star",
        x: 32599,
        s: 1.04,
        v: 2
      },
      {
        type: "crystal",
        x: 33005,
        s: 0.9,
        v: 1
      },
      {
        type: "crystal",
        x: 33421,
        s: 0.94,
        v: 1
      },
      {
        type: "star",
        x: 33996,
        s: 1.07,
        v: 2
      },
      {
        type: "crystal",
        x: 34475,
        s: 0.79,
        v: 0
      },
      {
        type: "crystal",
        x: 35108,
        s: 1.04,
        v: 2
      },
      {
        type: "crystal",
        x: 35529,
        s: 1.02,
        v: 0
      },
      {
        type: "crystal",
        x: 35961,
        s: 0.93,
        v: 2
      },
      {
        type: "star",
        x: 36374,
        s: 0.77,
        v: 2
      },
      {
        type: "crystal",
        x: 37063,
        s: 0.91,
        v: 2
      },
      {
        type: "crystal",
        x: 37514,
        s: 0.9,
        v: 1
      },
      {
        type: "star",
        x: 38040,
        s: 0.92,
        v: 2
      },
      {
        type: "crystal",
        x: 38554,
        s: 0.93,
        v: 0
      },
      {
        type: "crystal",
        x: 39243,
        s: 0.86,
        v: 1
      },
      {
        type: "crystal",
        x: 39886,
        s: 0.96,
        v: 2
      },
      {
        type: "star",
        x: 40476,
        s: 0.77,
        v: 1
      },
      {
        type: "crystal",
        x: 40985,
        s: 1.07,
        v: 2
      },
      {
        type: "crystal",
        x: 41739,
        s: 1.08,
        v: 2
      },
      {
        type: "crystal",
        x: 42304,
        s: 0.92,
        v: 1
      },
      {
        type: "crystal",
        x: 42944,
        s: 0.99,
        v: 2
      },
      {
        type: "snowman",
        x: 19626,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 43573
      }
    ]
  };

  // src/data/levels.js
  var LEVELS = [island01_default, island02_default, island03_default, island04_default, island05_default, island06_default, island07_default, island08_default, island09_default];

  // src/core/rng.js
  function makeRng(seed) {
    let a = seed >>> 0;
    const next = () => {
      a = a + 1831565813 >>> 0;
      let t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    return {
      next,
      range: (lo, hi) => lo + (hi - lo) * next(),
      int: (lo, hi) => Math.floor(lo + (hi - lo + 1) * next()),
      pick: (arr2) => arr2[Math.floor(next() * arr2.length)],
      chance: (p) => next() < p
    };
  }

  // src/core/world.js
  var SEA_GAP = 1500;
  var SEA_LEVEL = -520;
  function expandFish(level2, island2, ox) {
    const out = [];
    const add = (x, y, gold = false) => out.push({ x: ox + x, y, gold, taken: false, pull: 0 });
    for (const f of level2.fish || []) {
      const n = Math.max(1, f.n | 0);
      if (f.type === "arc") {
        for (let i = 0; i < n; i++) {
          const t = n === 1 ? 0.5 : i / (n - 1);
          const x = f.x + f.w * t;
          const y = f.y + f.h * 4 * t * (1 - t);
          add(x, y, !!f.gold && (f.goldAt == null ? i === Math.floor(n / 2) : i === f.goldAt));
        }
      } else if (f.type === "line") {
        for (let i = 0; i < n; i++) {
          const t = n === 1 ? 0 : i / (n - 1);
          add(f.x + (f.x2 - f.x) * t, f.y + (f.y2 - f.y) * t, !!f.gold && i === n - 1);
        }
      } else if (f.type === "ground") {
        const sp = f.spacing || 60;
        for (let i = 0; i < n; i++) {
          const lx = f.x + i * sp;
          add(lx, island2.localHeight(lx) + (f.off || 46), false);
        }
      } else {
        add(f.x, f.y, !!f.gold);
      }
    }
    return out;
  }
  var Island = class {
    constructor(level2, index, startX) {
      this.level = level2;
      this.index = index;
      this.id = level2.id;
      this.biome = level2.biome || "dawn";
      this.surface = level2.surface || "snow";
      this.startX = startX;
      const pts = level2.points;
      this.xs = new Float64Array(pts.length);
      this.ys = new Float64Array(pts.length);
      for (let i = 0; i < pts.length; i++) {
        this.xs[i] = startX + pts[i][0];
        this.ys[i] = pts[i][1];
      }
      this.endX = this.xs[pts.length - 1];
      this.rampX = this.xs[pts.length - 2];
      this.length = this.endX - startX;
      this.nextStartX = this.endX + SEA_GAP;
      this.ice = (level2.ice || []).map(([a, b]) => [startX + a, startX + b]).sort((p, q) => p[0] - q[0]);
      this.wind = (level2.wind || []).map((w) => ({ x: startX + w.x, w: w.w, h: w.h, power: w.power || 1 }));
      this.geysers = (level2.geysers || []).map((g) => ({ x: startX + g.x, used: false, t: 0 }));
      this.rings = (level2.rings || []).map((r) => ({ x: startX + r.x, y: r.y, r: r.r || 90, used: false }));
      this.decor = (level2.decor || []).map((d) => ({ ...d, x: startX + d.x }));
      this.blizzard = Object.assign({ startGap: 1100, speed: 700, accel: 6 }, level2.blizzard || {});
      this.fish = expandFish(level2, this, startX).sort((a, b) => a.x - b.x);
      this.fishTotal = this.fish.reduce((s, f) => s + (f.gold ? 10 : 1), 0);
      this._seg = 0;
    }
    localHeight(lx) {
      return this.heightAt(this.startX + lx);
    }
    _segment(x) {
      const xs = this.xs;
      let i = this._seg;
      if (i >= xs.length - 1) i = xs.length - 2;
      if (x >= xs[i] && x <= xs[i + 1]) return i;
      let lo = 0, hi = xs.length - 2;
      while (lo < hi) {
        const mid = lo + hi + 1 >> 1;
        if (xs[mid] <= x) lo = mid;
        else hi = mid - 1;
      }
      this._seg = lo;
      return lo;
    }
    // returns [y, dy/dx, d2y/dx2]
    sample(x, out) {
      const xs = this.xs, ys = this.ys;
      if (x <= xs[0]) {
        out[0] = ys[0];
        out[1] = 0;
        out[2] = 0;
        return out;
      }
      if (x >= this.endX) {
        out[0] = ys[ys.length - 1];
        out[1] = 0;
        out[2] = 0;
        return out;
      }
      const i = this._segment(x);
      const x0 = xs[i], x1 = xs[i + 1], y0 = ys[i], y1 = ys[i + 1];
      const w = x1 - x0;
      const t = (x - x0) / w;
      const a = Math.PI * t;
      const dy = y1 - y0;
      out[0] = y0 + dy * (1 - Math.cos(a)) * 0.5;
      out[1] = dy * Math.PI * 0.5 * Math.sin(a) / w;
      out[2] = dy * Math.PI * Math.PI * 0.5 * Math.cos(a) / (w * w);
      return out;
    }
    heightAt(x) {
      return this.sample(x, _tmp)[0];
    }
    isIce(x) {
      for (const [a, b] of this.ice) {
        if (x < a) return false;
        if (x <= b) return true;
      }
      return false;
    }
  };
  var _tmp = [0, 0, 0];
  var World = class {
    // levels: ordered list of level json. generator(index) supplies extra levels for endless mode.
    constructor(levels2, { startIndex = 0, generator = null } = {}) {
      this.levels = levels2;
      this.generator = generator;
      this.islands = [];
      this.originIndex = startIndex;
      let x = 0;
      this.baseX = 0;
      for (let i = 0; i < startIndex && i < levels2.length; i++) {
        x += levels2[i].points[levels2[i].points.length - 1][0] + SEA_GAP;
      }
      this.baseX = x;
      this._nextBuildIndex = startIndex;
      this._nextBuildX = x;
      this.ensureIslands(2);
      this._last = this.islands[0];
    }
    levelFor(index) {
      if (index < this.levels.length) return this.levels[index];
      if (this.generator) return this.generator(index);
      return null;
    }
    ensureIslands(count) {
      while (this.islands.length < count) {
        const lv = this.levelFor(this._nextBuildIndex);
        if (!lv) return false;
        const isl = new Island(lv, this._nextBuildIndex, this._nextBuildX);
        this.islands.push(isl);
        this._nextBuildX = isl.nextStartX;
        this._nextBuildIndex++;
      }
      return true;
    }
    // Island whose span [startX, nextStartX) contains x.
    islandAt(x) {
      const l = this._last;
      if (l && x >= l.startX && x < l.nextStartX) return l;
      for (const isl of this.islands) {
        if (x >= isl.startX && x < isl.nextStartX) {
          this._last = isl;
          return isl;
        }
      }
      if (this.islands.length && x < this.islands[0].startX) return this.islands[0];
      return this.islands[this.islands.length - 1];
    }
    inGap(x) {
      const isl = this.islandAt(x);
      return x > isl.endX;
    }
    sample(x, out = [0, 0, 0]) {
      const isl = this.islandAt(x);
      if (x > isl.endX) {
        out[0] = SEA_LEVEL;
        out[1] = 0;
        out[2] = 0;
        return out;
      }
      return isl.sample(x, out);
    }
    heightAt(x) {
      return this.sample(x, _tmp)[0];
    }
    // Height used for drawing: islands fall off into the sea with a cliff curve.
    drawHeightAt(x) {
      const isl = this.islandAt(x);
      if (x <= isl.endX) {
        if (x < isl.startX) return this._cliffIn(isl, x);
        return isl.heightAt(x);
      }
      const next = this.islands[this.islands.indexOf(isl) + 1];
      const d = x - isl.endX;
      const yEnd = isl.ys[isl.ys.length - 1];
      const outDrop = Math.min(1, d / 260);
      const yOut = yEnd + (SEA_LEVEL - 200 - yEnd) * (outDrop * outDrop * (3 - 2 * outDrop));
      if (!next) return yOut;
      const din = next.startX - x;
      if (din < 260) return Math.max(yOut, this._cliffIn(next, x));
      return yOut;
    }
    _cliffIn(isl, x) {
      const d = isl.startX - x;
      const y0 = isl.ys[0];
      const t = Math.min(1, Math.max(0, d / 260));
      return y0 + (SEA_LEVEL - 200 - y0) * (t * t * (3 - 2 * t));
    }
  };

  // src/core/run.js
  var STEP = 1 / 120;
  var tmp = [0, 0, 0];
  function upgradeValue(balance, key, level2) {
    const u = balance.upgrades[key];
    if (!u) return 0;
    const lv = Math.max(0, Math.min(u.maxLevel, level2 | 0));
    return u.values[lv];
  }
  var RunSim = class {
    constructor({ levels: levels2, balance, upgrades = {}, startIndex = 0, tutorial = false, assist = 0, generator = null, modifiers = {} }) {
      this.balance = balance;
      this.P = balance.physics;
      this.world = new World(levels2, { startIndex, generator });
      this.modifiers = modifiers;
      this.up = {
        flap: upgradeValue(balance, "flap", upgrades.flap),
        slide: upgradeValue(balance, "slide", upgrades.slide),
        magnet: upgradeValue(balance, "magnet", upgrades.magnet),
        glide: upgradeValue(balance, "glide", upgrades.glide),
        scarf: upgradeValue(balance, "scarf", upgrades.scarf)
      };
      const sl = Math.max(0, Math.min(5, upgrades.scarf | 0));
      this.scarfPush = (balance.upgrades.scarf.pushback || [])[sl] || 800;
      this.scarfCharges = this.up.scarf;
      this.assist = assist;
      this.tutorial = tutorial;
      this.time = 0;
      this.state = "run";
      this.events = [];
      this.island = this.world.islands[0];
      this.islandTime = 0;
      this.islandsCleared = 0;
      this.startIndex = startIndex;
      const isl = this.island;
      const p = {
        x: isl.startX + 4,
        y: 0,
        vx: 0,
        vy: 0,
        s: this.P.startSpeed * (modifiers.startSpeedMul || 1),
        ground: true,
        press: false,
        stun: 0,
        air: 0,
        fever: 0,
        chain: 0,
        flightMax: 0,
        milestone: 0,
        lastLand: null,
        angle: 0,
        slope: 0,
        ice: false
      };
      p.y = isl.heightAt(p.x);
      this.p = p;
      this.blizzardX = p.x - isl.blizzard.startGap;
      this.blizzardV = 0;
      this.blizzardHold = tutorial ? balance.blizzard.tutorialDelay : 0.8;
      this.crossing = null;
      this.fishIndex = 0;
      this.pulling = [];
      this.stats = {
        fish: 0,
        gold: 0,
        fishValue: 0,
        perfect: 0,
        good: 0,
        bonk: 0,
        fevers: 0,
        maxHeight: 0,
        maxSpeed: 0,
        airTime: 0,
        groundTime: 0,
        pressUp: 0,
        pressDown: 0,
        releaseDown: 0,
        releaseUp: 0,
        milestoneFish: 0,
        rings: 0,
        geysers: 0,
        secondWinds: 0,
        closeCalls: 0,
        minGap: 1e9,
        hills: 0
      };
      this._wasDanger = false;
      this.islandStats = {};
      this.istat = this._istat(this.island.index);
    }
    _istat(i) {
      return this.islandStats[i] || (this.islandStats[i] = { fishValue: 0, gold: 0, perfect: 0, fevers: 0, rings: 0, maxHeight: 0 });
    }
    get distanceUnits() {
      return this.p.x;
    }
    get distanceMeters() {
      return Math.max(0, Math.floor(this.p.x / this.balance.display.unitsPerMeter));
    }
    get gap() {
      return this.p.x - this.blizzardX;
    }
    get heightAboveGround() {
      return this.p.ground ? 0 : this.p.y - this.world.heightAt(this.p.x);
    }
    emit(type, data = {}) {
      this.events.push({ type, t: this.time, ...data });
    }
    drainEvents() {
      const e = this.events;
      this.events = [];
      return e;
    }
    maxSpeed() {
      const P = this.P;
      return P.maxSpeed * (1 + this.up.slide * 0.6) * (this.p.fever > 0 ? P.feverSpeedMul : 1);
    }
    step(dt, press) {
      this.time += dt;
      const p = this.p;
      p.press = press;
      if (this.state === "caught") return;
      if (this.state === "crossing") {
        this._stepCrossing(dt);
        return;
      }
      this.islandTime += dt;
      if (p.stun > 0) p.stun -= dt;
      if (p.fever > 0) {
        p.fever -= dt;
        if (p.fever <= 0) {
          p.fever = 0;
          this.emit("feverEnd");
        }
      }
      if (p.ground) this._stepGround(dt, press);
      else this._stepAir(dt, press);
      this._collect();
      this._objects(dt);
      this._blizzard(dt);
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > this.stats.maxSpeed) this.stats.maxSpeed = sp;
      if (p.x >= this.island.endX && this.state === "run") this._startCrossing();
    }
    _stepGround(dt, press) {
      const P = this.P, p = this.p, isl = this.island;
      isl.sample(p.x, tmp);
      let d = tmp[1];
      const dd = tmp[2];
      const cos = 1 / Math.sqrt(1 + d * d);
      const sin = d * cos;
      const ice = isl.isIce(p.x) || this.modifiers.allIce;
      p.ice = ice;
      const cloud = isl.surface === "cloud";
      const effPress = press && p.stun <= 0;
      let g = P.gravity;
      if (effPress) {
        g *= P.pressGravityMul;
        if (d < 0) g *= 1 + this.up.slide;
        if (d < 0 && ice) g *= P.iceAccelMul;
      }
      let fr = P.groundFriction * (ice ? P.iceFrictionMul : 1) * (cloud ? 1.4 : 1);
      let a = -g * sin - fr - P.groundDrag * (1 - this.up.slide) * p.s * p.s;
      if (p.x > isl.rampX && d > 0) {
        a = Math.max(a, 900);
        if (p.s < 1500) p.s = Math.min(1500, p.s + 3e3 * dt);
        p.onRamp = true;
      }
      p.s += a * dt;
      const ms = this.maxSpeed();
      if (p.s > ms) p.s = ms - (p.s - ms) * 0.5;
      if (p.s < P.minSpeed) p.s = P.minSpeed;
      this.stats.groundTime += dt;
      if (d > 0.08) {
        if (press) this.stats.pressUp += dt;
        else this.stats.releaseUp += dt;
      } else if (d < -0.08) {
        if (press) this.stats.pressDown += dt;
        else this.stats.releaseDown += dt;
      }
      const kappa = -dd / Math.pow(1 + d * d, 1.5);
      const normal = g * cos - p.s * p.s * kappa;
      if (normal < 0) {
        this._takeoff(cos, sin);
        return;
      }
      p.x += p.s * cos * dt;
      isl.sample(p.x, tmp);
      p.y = tmp[0];
      p.slope = tmp[1];
      p.vx = p.s * cos;
      p.vy = p.s * sin;
    }
    _takeoff(cos, sin) {
      const p = this.p;
      p.ground = false;
      p.vx = p.s * cos;
      p.vy = p.s * sin;
      let flapV = 0;
      if (this.up.flap > 0 && sin > -0.05) {
        flapV = this.up.flap * p.s * Math.max(0.15, sin + 0.25);
        p.vy += flapV;
        p.vx += this.up.flap * p.s * 0.3;
      }
      p.air = 0;
      p.flightMax = 0;
      p.milestone = 0;
      p.takeoffX = p.x;
      p.takeoffY = p.y;
      p.flapV = flapV;
      p.launchSpeed = p.s;
      p.announced = false;
    }
    _stepAir(dt, press) {
      const P = this.P, p = this.p, isl = this.island;
      let g = P.gravity;
      if (press) g *= P.airPressGravityMul;
      else if (p.vy < 0 && this.up.glide > 0) g *= 1 - this.up.glide;
      p.y += p.vy * dt - 0.5 * g * dt * dt;
      p.vy -= g * dt;
      if (!press) {
        for (const w of isl.wind) {
          if (p.x >= w.x && p.x <= w.x + w.w) {
            const gy2 = isl.heightAt(p.x);
            if (p.y < gy2 + w.h) {
              p.vy += P.windAccel * w.power * dt;
              if (p.vy > 1500) p.vy = 1500;
              if (!w._inside && !this.ghost) {
                w._inside = true;
                this.emit("wind", { x: p.x });
              }
            }
          } else if (!this.ghost) w._inside = false;
        }
      }
      const sp = Math.hypot(p.vx, p.vy);
      const drag2 = 1 - P.airDrag * (1 - this.up.glide) * sp * dt;
      p.vx *= drag2;
      p.vy *= drag2;
      if (p.vx < P.minSpeed * 0.6) p.vx = P.minSpeed * 0.6;
      p.x += p.vx * dt;
      p.air += dt;
      this.stats.airTime += dt;
      const gy = this.world.heightAt(p.x);
      const h = p.y - gy;
      if (!p.announced && p.air > 0.07 && h > 6) {
        p.announced = true;
        this.stats.hills++;
        this.emit("takeoff", { speed: p.launchSpeed, angle: Math.atan2(p.vy, p.vx), flap: p.flapV || 0 });
      }
      if (h > p.flightMax) {
        p.flightMax = h;
        if (h > this.stats.maxHeight) this.stats.maxHeight = h;
        if (!this.ghost && h > this.istat.maxHeight) this.istat.maxHeight = h;
        const ms = P.heightMilestones;
        const upm = this.balance.display.unitsPerMeter;
        while (p.milestone < ms.length && h >= ms[p.milestone] * upm) {
          const bonus = P.heightMilestoneFish[p.milestone];
          this.stats.milestoneFish += bonus;
          this.emit("height", { meters: ms[p.milestone], bonus, level: p.milestone });
          p.milestone++;
        }
      }
      for (const r of isl.rings) {
        if (r.used || this.ghost && this._ghostRings.has(r)) continue;
        const dx = p.x - r.x, dy = p.y - r.y;
        if (dx * dx + dy * dy < r.r * r.r) {
          if (this.ghost) this._ghostRings.add(r);
          else r.used = true;
          p.vx *= P.ringBoost;
          p.vy = Math.max(p.vy, 0) * P.ringBoost + 200;
          this.stats.rings++;
          if (!this.ghost) this.istat.rings++;
          this.emit("ring", { x: r.x, y: r.y });
        }
      }
      if (p.y <= gy && p.x <= isl.endX) this._land(gy);
    }
    _land(gy) {
      const P = this.P, p = this.p, isl = this.island;
      isl.sample(p.x, tmp);
      const d = tmp[1];
      const speed = Math.hypot(p.vx, p.vy);
      const angV = Math.atan2(p.vy, p.vx);
      const angT = Math.atan(d);
      const alpha = Math.abs(angV - angT);
      const along = speed * Math.cos(Math.min(alpha, Math.PI / 2));
      const cloud = isl.surface === "cloud";
      p.ground = true;
      p.y = gy;
      const airT = p.air;
      let kind;
      if (!p.announced || airT < 0.28 && p.flightMax < 70) {
        kind = "touch";
        p.s = Math.max(along, P.minSpeed);
      } else if (alpha < P.perfectAngle * (cloud ? 1.4 : 1) && d < -P.perfectMinDownSlope) {
        kind = "perfect";
        p.s = along * P.perfectBoost;
        p.chain++;
        this.stats.perfect++;
        if (!this.ghost) this.istat.perfect++;
      } else if (alpha > P.bonkAngle && !cloud && p.fever <= 0) {
        kind = "bonk";
        p.s = along * P.bonkKeep;
        p.stun = P.bonkStun;
        p.chain = 0;
        this.stats.bonk++;
      } else {
        kind = "good";
        p.s = along * P.landKeep;
        if (cloud) p.s *= 1.03;
        p.chain = 0;
        this.stats.good++;
      }
      if (p.s < P.minSpeed) p.s = P.minSpeed;
      const ms = this.maxSpeed();
      if (p.s > ms) p.s = ms;
      p.lastLand = kind;
      if (kind !== "touch") {
        this.emit("land", { kind, alpha, speed: p.s, air: airT, height: p.flightMax, chain: p.chain });
        if (kind === "perfect" && p.chain >= P.feverChain && p.fever <= 0) {
          p.fever = P.feverTime;
          this.stats.fevers++;
          if (!this.ghost) this.istat.fevers++;
          this.blizzardX = Math.max(this.blizzardX - P.feverBlizzardPush, p.x - this.balance.blizzard.maxGap);
          this.emit("fever");
        } else if (kind === "perfect" && p.fever > 0) {
          p.fever = Math.max(p.fever, P.feverTime * 0.6);
        }
      }
    }
    _collect() {
      const p = this.p, isl = this.island;
      const fish = isl.fish;
      const pickR = this.P.radius + 30;
      const magR = this.up.magnet;
      const reach = Math.max(pickR, magR) + 40;
      while (this.fishIndex < fish.length && fish[this.fishIndex].x < p.x - reach - 200) this.fishIndex++;
      for (let i = this.fishIndex; i < fish.length; i++) {
        const f = fish[i];
        if (f.x > p.x + reach) break;
        if (f.taken) continue;
        const dx = f.x - p.x, dy = f.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < pickR * pickR) this._take(f);
        else if (magR > 0 && d2 < magR * magR && !f.pull) {
          f.pull = 1;
          this.pulling.push(f);
        }
      }
      if (this.pulling.length) {
        for (let i = this.pulling.length - 1; i >= 0; i--) {
          const f = this.pulling[i];
          if (f.taken) {
            this.pulling.splice(i, 1);
            continue;
          }
          const dx = p.x - f.x, dy = p.y - f.y;
          const d = Math.hypot(dx, dy) || 1;
          const v = (2400 + Math.hypot(p.vx, p.vy)) * STEP;
          if (d < v + pickR) {
            this._take(f);
            this.pulling.splice(i, 1);
          } else {
            f.x += dx / d * v;
            f.y += dy / d * v;
          }
        }
      }
    }
    _take(f) {
      f.taken = true;
      const E = this.balance.economy;
      const mul = this.p.fever > 0 ? 2 : 1;
      const v = (f.gold ? E.goldFishValue : E.fishValue) * mul;
      this.stats.fishValue += v;
      this.istat.fishValue += v;
      if (f.gold) {
        this.stats.gold++;
        this.istat.gold++;
      } else this.stats.fish++;
      this.emit("fish", { gold: f.gold, value: v, x: f.x, y: f.y });
    }
    _objects(dt) {
      const p = this.p, isl = this.island, P = this.P;
      if (p.ground) {
        for (const g of isl.geysers) {
          if (!g.used && Math.abs(p.x - g.x) < 46) {
            g.used = true;
            isl.sample(p.x, tmp);
            const cos = 1 / Math.sqrt(1 + tmp[1] * tmp[1]);
            p.ground = false;
            p.vx = Math.max(p.s * cos, 700);
            p.vy = P.geyserImpulse + Math.max(0, p.s * tmp[1] * cos);
            p.air = 0;
            p.flightMax = 0;
            p.milestone = 0;
            this.stats.geysers++;
            this.emit("geyser", { x: g.x });
          }
        }
      }
    }
    _blizzard(dt) {
      const B = this.balance.blizzard;
      const isl = this.island;
      const gap = this.gap;
      let v = (isl.blizzard.speed + isl.blizzard.accel * this.islandTime) * (1 - this.assist);
      if (this.modifiers.blizzardMul) v *= this.modifiers.blizzardMul;
      if (gap > B.maxGap) v += (gap - B.maxGap) * B.rubberBandMul;
      if (this.blizzardHold > 0) {
        this.blizzardHold -= dt;
        if (gap <= B.maxGap) v = 0;
      }
      this.blizzardV = v;
      this.blizzardX += v * dt;
      const g2 = this.gap;
      if (g2 < this.stats.minGap) this.stats.minGap = g2;
      const danger = g2 < B.dangerGap;
      if (danger && !this._wasDanger) this.emit("danger");
      if (!danger && this._wasDanger && g2 > B.dangerGap * 1.4) {
        this.stats.closeCalls++;
        this.emit("escape");
        this._wasDanger = false;
      }
      if (danger) this._wasDanger = true;
      if (g2 <= 0) {
        if (this.scarfCharges > 0) {
          this.scarfCharges--;
          this.stats.secondWinds++;
          this.blizzardX = this.p.x - this.scarfPush;
          const p = this.p;
          if (p.ground) p.s = Math.min(this.maxSpeed(), p.s * 1.25 + 300);
          else p.vx += 300;
          this.emit("secondWind");
        } else {
          this.state = "caught";
          this.emit("caught", { x: this.p.x });
        }
      }
    }
    _startCrossing() {
      const p = this.p, from = this.island;
      this.world.ensureIslands(this.world.islands.indexOf(from) + 2);
      const next = this.world.islands[this.world.islands.indexOf(from) + 1];
      if (!next) {
        this.state = "caught";
        this.emit("caught", { x: p.x, end: true });
        return;
      }
      const lx = next.xs[0] + (next.xs[1] - next.xs[0]) * 0.42;
      const ly = next.heightAt(lx);
      const apex = Math.max(p.y, ly) + 900;
      this.crossing = {
        t: 0,
        T: 2.6,
        x0: p.x,
        y0: p.y,
        x1: lx,
        y1: ly,
        H: apex - (p.y + ly) / 2,
        from,
        next,
        speed: Math.max(p.ground ? p.s : Math.hypot(p.vx, p.vy), 900)
      };
      this.state = "crossing";
      p.ground = false;
      this.islandsCleared++;
      this.emit("islandClear", { index: from.index });
    }
    _stepCrossing(dt) {
      const c = this.crossing, p = this.p;
      c.t += dt;
      const u = Math.min(1, c.t / c.T);
      const e = u;
      const nx = c.x0 + (c.x1 - c.x0) * e;
      const ny = c.y0 + (c.y1 - c.y0) * e + 4 * c.H * e * (1 - e);
      p.vx = (nx - p.x) / dt;
      p.vy = (ny - p.y) / dt;
      p.x = nx;
      p.y = ny;
      this.blizzardX = p.x - 4e3;
      if (u >= 1) {
        const next = c.next;
        this.island = next;
        this.istat = this._istat(next.index);
        this.islandTime = 0;
        this.fishIndex = 0;
        next.sample(p.x, tmp);
        const cos = 1 / Math.sqrt(1 + tmp[1] * tmp[1]);
        p.ground = true;
        p.y = tmp[0];
        p.s = Math.min(this.maxSpeed(), Math.max(c.speed * 0.9, 1100));
        p.vx = p.s * cos;
        p.vy = p.s * tmp[1] * cos;
        p.chain = 0;
        this.blizzardX = p.x - next.blizzard.startGap;
        this.blizzardHold = 1.2;
        this.state = "run";
        this.crossing = null;
        while (this.world.islands.length > 3 && this.world.islands[0] !== next && this.world.islands[1] !== next) this.world.islands.shift();
        this.world.ensureIslands(this.world.islands.indexOf(next) + 2);
        this.emit("islandReach", { index: next.index });
      }
    }
  };
  function makeGhost(sim) {
    const g = Object.create(RunSim.prototype);
    g.ghost = true;
    g.balance = sim.balance;
    g.P = sim.P;
    g.up = sim.up;
    g.world = sim.world;
    g.modifiers = sim.modifiers;
    g.island = sim.island;
    g.p = { ...sim.p };
    g.stats = { ...sim.stats };
    g.events = [];
    g.emit = () => {
    };
    g.blizzardX = sim.blizzardX;
    g._ghostRings = /* @__PURE__ */ new Set();
    g.time = sim.time;
    return g;
  }
  function ghostStep(g, dt, press) {
    const p = g.p;
    p.press = press;
    if (p.stun > 0) p.stun -= dt;
    if (p.fever > 0) p.fever -= dt;
    if (p.ground) g._stepGround(dt, press);
    else g._stepAir(dt, press);
    if (p.ground) {
      for (const gz of g.island.geysers) {
        if (!gz.used && Math.abs(p.x - gz.x) < 46) {
          p.ground = false;
          p.vx = Math.max(p.s, 700);
          p.vy = g.P.geyserImpulse;
          p.air = 0;
        }
      }
    }
  }
  function forecastLanding(sim, press, maxT = 3) {
    const P = sim.P, isl = sim.island, up = sim.up;
    let x = sim.p.x, y = sim.p.y, vx = sim.p.vx, vy = sim.p.vy;
    const dt = 1 / 60;
    for (let t = 0; t < maxT; t += dt) {
      let g = P.gravity;
      if (press) g *= P.airPressGravityMul;
      else if (vy < 0 && up.glide > 0) g *= 1 - up.glide;
      vy -= g * dt;
      x += vx * dt;
      y += vy * dt;
      if (x > isl.endX) return { x, y, t, past: true };
      isl.sample(x, tmp);
      if (y <= tmp[0]) {
        const d = tmp[1];
        const alpha = Math.abs(Math.atan2(vy, vx) - Math.atan(d));
        return { x, y: tmp[0], t, slope: d, alpha, perfect: alpha < P.perfectAngle && d < -P.perfectMinDownSlope, bonk: alpha > P.bonkAngle };
      }
    }
    return { x, y, t: maxT, none: true };
  }

  // src/core/bot.js
  var BOT_PROFILES = {
    expert: { delay: 0.03, lead: 0.05, noise: 0, holdUpChance: 0, earlyRelease: 0, airSmart: 1, plan: true },
    good: { delay: 0.08, lead: 0.05, noise: 0.04, holdUpChance: 0.05, earlyRelease: 0.05, airSmart: 0.85 },
    average: { delay: 0.14, lead: 0.04, noise: 0.08, holdUpChance: 0.15, earlyRelease: 0.12, airSmart: 0.6 },
    novice: { delay: 0.22, lead: 0.02, noise: 0.14, holdUpChance: 0.35, earlyRelease: 0.25, airSmart: 0.25 }
  };
  var tmp2 = [0, 0, 0];
  function makeBot(profileName = "good", seed = 1) {
    const prof = typeof profileName === "string" ? BOT_PROFILES[profileName] : profileName;
    const rng = makeRng(seed);
    const queue = [];
    let current = false;
    let hillMistake = 0;
    let lastGroundSign = 0;
    let airDecision = null;
    let airTimer = 0;
    const PLANS = [[1, 1, 30], [0, 0, 30], [1, 0, 30], [0, 1, 30], [1, 0, 70], [0, 1, 70]];
    let planHold = 0, planPress = false;
    function plan(sim) {
      planHold -= 1 / 120;
      if (planHold > 0) return planPress;
      planHold = 0.08;
      let best = -1e18, bestPress = false;
      for (const [a, b, sw] of PLANS) {
        const g = makeGhost(sim);
        let bonks = 0, perfect = 0;
        const n = 200;
        for (let i = 0; i < n; i++) {
          const pr = (i < sw ? a : b) === 1;
          const wasAir = !g.p.ground;
          ghostStep(g, 1 / 120, pr);
          if (wasAir && g.p.ground && g.p.lastLand === "bonk") bonks++;
          if (wasAir && g.p.ground && g.p.lastLand === "perfect") perfect++;
        }
        const sp = g.p.ground ? g.p.s : Math.hypot(g.p.vx, g.p.vy);
        let score = g.p.x + sp * 0.7 - bonks * 1500 + perfect * 300;
        if (!g.p.ground) {
          const f = forecastLanding(g, false, 2.5);
          if (f.bonk) score -= 1200;
          else if (f.perfect) score += 250;
        }
        if (score > best) {
          best = score;
          bestPress = a === 1;
        }
      }
      planPress = bestPress;
      return planPress;
    }
    function desired(sim) {
      const p = sim.p;
      if (sim.state !== "run") return false;
      if (prof.plan) return plan(sim);
      if (p.ground) {
        airDecision = null;
        const lead = Math.max(0, prof.lead + (rng.next() - 0.5) * prof.noise);
        sim.island.sample(p.x + p.s * lead, tmp2);
        const slopeAhead = tmp2[1];
        const sign = slopeAhead < -0.015 ? -1 : 1;
        if (sign !== lastGroundSign) {
          lastGroundSign = sign;
          hillMistake = 0;
          if (sign > 0 && rng.chance(prof.holdUpChance)) hillMistake = rng.range(0.1, 0.45);
          if (sign < 0 && rng.chance(prof.earlyRelease)) hillMistake = -rng.range(0.1, 0.35);
        }
        if (sign < 0) {
          if (hillMistake < 0) {
            sim.island.sample(p.x, tmp2);
            if (tmp2[1] > -0.35 + hillMistake) return false;
          }
          return true;
        }
        if (hillMistake > 0) {
          hillMistake -= 1 / 120;
          return true;
        }
        return false;
      }
      airTimer -= 1 / 120;
      if (airDecision === null || airTimer <= 0) {
        airTimer = 0.1;
        if (rng.next() > prof.airSmart) {
          airDecision = p.vy < -200 && rng.chance(0.5);
        } else {
          const free = forecastLanding(sim, false);
          const dive = forecastLanding(sim, true);
          const score = (f) => f.past ? 3 : f.none ? 0.5 : f.perfect ? 2.5 : f.bonk ? -2 : f.slope < 0 ? 1 : 0;
          const sf = score(free), sd = score(dive);
          airDecision = sd > sf + 0.01;
        }
      }
      return airDecision;
    }
    return function control(sim) {
      const want = desired(sim);
      queue.push([sim.time + prof.delay, want]);
      while (queue.length && queue[0][0] <= sim.time) current = queue.shift()[1];
      return current;
    };
  }
  function playRun(sim, control, maxTime = 600, onStep = null) {
    const dt = 1 / 120;
    let presses = 0, last = false;
    while (sim.state !== "caught" && sim.time < maxTime) {
      const press = control(sim);
      if (press && !last) presses++;
      last = press;
      sim.step(dt, press);
      if (onStep) onStep(sim, press);
    }
    return {
      time: sim.time,
      distance: sim.distanceMeters,
      islandsCleared: sim.islandsCleared,
      island: sim.island.index,
      presses,
      ...sim.stats
    };
  }

  // src/core/validate.js
  function checkStructure(level2) {
    const errors = [], warnings = [];
    const pts = level2.points || [];
    if (pts.length < 4) errors.push("points: need at least 4 keypoints");
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i][0] - pts[i - 1][0];
      if (dx <= 0) errors.push(`points[${i}]: x must increase (${pts[i - 1][0]} -> ${pts[i][0]})`);
      else if (dx < 140) warnings.push(`points[${i}]: segment very short (${dx})`);
      const slope = Math.PI / 2 * Math.abs(pts[i][1] - pts[i - 1][1]) / Math.max(1, dx);
      if (slope > 2.4) warnings.push(`points[${i}]: very steep (max slope ${slope.toFixed(2)})`);
    }
    const len = pts.length ? pts[pts.length - 1][0] : 0;
    if (pts.length > 2 && pts[pts.length - 1][1] < pts[pts.length - 2][1] + 300) warnings.push("end ramp: last keypoint should be a tall crest (launch ramp)");
    for (const [a, b] of level2.ice || []) if (!(a < b) || a < 0 || b > len) errors.push(`ice [${a},${b}] out of range`);
    for (const w of level2.wind || []) if (w.x < 0 || w.x + w.w > len) errors.push(`wind at ${w.x} out of range`);
    for (const g of level2.geysers || []) if (g.x < 0 || g.x > len) errors.push(`geyser at ${g.x} out of range`);
    for (const f of level2.fish || []) {
      if (f.x < 0 || f.x > len) errors.push(`fish at ${f.x} out of range`);
    }
    if (!level2.blizzard || !(level2.blizzard.speed > 0)) errors.push("blizzard.speed missing");
    if (!level2.name || !level2.name.ko || !level2.name.en) errors.push("name.ko / name.en missing");
    return { errors, warnings };
  }
  function checkClearable(levels2, index, balance, { seeds = 6, profiles = ["expert", "good", "average", "novice"], upgrades = null } = {}) {
    const lv = levels2[index];
    const ups = upgrades || lv.expect && lv.expect.upgrades || {};
    const result = { id: lv.id, index, upgrades: ups, profiles: {} };
    for (const prof of profiles) {
      let clears = 0, time = 0, fish = 0, prog = 0, perfect = 0, bonk = 0, height = 0;
      for (let s = 1; s <= seeds; s++) {
        const sim2 = new RunSim({ levels: levels2.slice(0, index + 1), balance, upgrades: ups, startIndex: index });
        const isl = sim2.island;
        const r = playRun(sim2, makeBot(prof, s * 31 + index), 400);
        const cleared = r.islandsCleared > 0 || sim2.p.x >= isl.endX - 5;
        if (cleared) clears++;
        time += r.time;
        fish += r.fishValue;
        perfect += r.perfect;
        bonk += r.bonk;
        height += r.maxHeight;
        prog += Math.min(1, (sim2.p.x - isl.startX) / isl.length);
      }
      result.profiles[prof] = {
        clearRate: clears / seeds,
        avgTime: time / seeds,
        avgFish: fish / seeds,
        avgProgress: prog / seeds,
        avgPerfect: perfect / seeds,
        avgBonk: bonk / seeds,
        avgMaxHeightM: height / seeds / balance.display.unitsPerMeter
      };
    }
    const sim = new RunSim({ levels: levels2.slice(0, index + 1), balance, startIndex: index });
    result.fishAvailable = sim.island.fishTotal;
    result.lengthM = Math.round(sim.island.length / balance.display.unitsPerMeter);
    const P = result.profiles;
    result.pass = (P.good ? P.good.clearRate >= 0.8 : true) && (P.expert ? P.expert.clearRate >= 1 : true);
    result.notes = [];
    if (P.good && P.good.clearRate < 0.8) result.notes.push("too hard: good player with expected upgrades clears < 80%");
    if (P.average && P.average.clearRate > 0.95 && index > 0) result.notes.push("maybe too easy: average player always clears");
    if (P.average && P.average.clearRate < 0.2) result.notes.push("steep: average player rarely clears (upgrades or practice needed)");
    return result;
  }

  // src/editor/editor.js
  var $ = (id) => document.getElementById(id);
  var DRAFTS = "ps.editor.drafts";
  var BIOMES = ["dawn", "pine", "lake", "wind", "sunset", "geyser", "aurora", "cloud", "stars"];
  var DECOR = ["pine", "rock", "crystal", "snowman", "spire", "balloon", "star", "sign", "flag"];
  var TOOLS = [
    ["select", "\uC120\uD0DD/\uC774\uB3D9"],
    ["point", "+\uC5B8\uB355\uC810"],
    ["fish", "+\uBB3C\uACE0\uAE30"],
    ["arc", "+\uBB3C\uACE0\uAE30 \uD638"],
    ["ground", "+\uBC14\uB2E5 \uBB3C\uACE0\uAE30"],
    ["gold", "+\uD669\uAE08"],
    ["ice", "+\uC5BC\uC74C"],
    ["wind", "+\uBC14\uB78C"],
    ["geyser", "+\uAC04\uD5D0\uCC9C"],
    ["ring", "+\uACE0\uB9AC"],
    ["decor", "+\uC7A5\uC2DD"],
    ["delete", "\uC0AD\uC81C"]
  ];
  var levels = LEVELS.map((l) => JSON.parse(JSON.stringify(l)));
  try {
    const d = JSON.parse(localStorage.getItem(DRAFTS) || "null");
    if (Array.isArray(d) && d.length) levels = d;
  } catch (e) {
  }
  var cur = 0;
  var tool = "select";
  var sel = null;
  var view = { x: -200, y: -700, s: 0.32 };
  var drag = null;
  var results = {};
  var trail = null;
  var island = null;
  var cv = $("cv");
  var ctx = cv.getContext("2d");
  function level() {
    return levels[cur];
  }
  function rebuild() {
    island = new Island(level(), 0, 0);
  }
  function saveDrafts() {
    try {
      localStorage.setItem(DRAFTS, JSON.stringify(levels));
    } catch (e) {
    }
  }
  function changed() {
    rebuild();
    saveDrafts();
    results[cur] = null;
    trail = null;
    renderList();
    draw();
  }
  var W = () => cv.clientWidth;
  var H = () => cv.clientHeight;
  var sx = (x) => (x - view.x) * view.s;
  var sy = (y) => H() - (y - view.y) * view.s;
  var wx = (px) => px / view.s + view.x;
  var wy = (py) => (H() - py) / view.s + view.y;
  function resize() {
    const r = cv.getBoundingClientRect();
    cv.width = r.width * devicePixelRatio;
    cv.height = r.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    draw();
  }
  function draw() {
    if (!island) rebuild();
    const lv = level();
    ctx.clearRect(0, 0, W(), H());
    ctx.strokeStyle = "rgba(30,35,80,.08)";
    ctx.lineWidth = 1;
    for (let x = Math.floor(wx(0) / 500) * 500; x < wx(W()); x += 500) {
      ctx.beginPath();
      ctx.moveTo(sx(x), 0);
      ctx.lineTo(sx(x), H());
      ctx.stroke();
    }
    for (let y = Math.floor(wy(H()) / 250) * 250; y < wy(0); y += 250) {
      ctx.beginPath();
      ctx.moveTo(0, sy(y));
      ctx.lineTo(W(), sy(y));
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(30,35,80,.5)";
    ctx.font = "11px monospace";
    const stepU = [1e3, 2e3, 5e3, 1e4].find((u) => u * view.s > 70) || 2e4;
    for (let x = Math.floor(wx(0) / stepU) * stepU; x < wx(W()); x += stepU) ctx.fillText(x / balance_default.display.unitsPerMeter + "m", sx(x) + 3, 14);
    for (const [i, w] of (lv.wind || []).entries()) {
      const gy = island.localHeight(w.x + w.w / 2);
      ctx.fillStyle = isSel("wind", i) ? "rgba(255,154,46,.35)" : "rgba(180,220,255,.45)";
      ctx.fillRect(sx(w.x), sy(gy + w.h), w.w * view.s, w.h * view.s);
    }
    const pts = lv.points;
    const L = pts[pts.length - 1][0];
    ctx.beginPath();
    ctx.moveTo(sx(0), H());
    for (let x = 0; x <= L; x += Math.max(4, 6 / view.s)) ctx.lineTo(sx(x), sy(island.localHeight(x)));
    ctx.lineTo(sx(L), sy(island.localHeight(L)));
    ctx.lineTo(sx(L), H());
    ctx.closePath();
    ctx.fillStyle = lv.surface === "cloud" ? "#fdf2ff" : "#f4f9ff";
    ctx.fill();
    ctx.strokeStyle = "#1e2350";
    ctx.lineWidth = 2;
    ctx.stroke();
    const rx = pts[pts.length - 2][0];
    ctx.fillStyle = "rgba(255,201,51,.25)";
    ctx.fillRect(sx(rx), 0, (L - rx) * view.s, H());
    for (const [i, [a, b]] of (lv.ice || []).entries()) {
      ctx.strokeStyle = isSel("ice", i) ? "#ff9a2e" : "#4fb6e8";
      ctx.lineWidth = 7;
      ctx.beginPath();
      for (let x = a; x <= b; x += 10) {
        const y = sy(island.localHeight(x));
        if (x === a) ctx.moveTo(sx(x), y);
        else ctx.lineTo(sx(x), y);
      }
      ctx.stroke();
      handle(sx(a), sy(island.localHeight(a)), "#4fb6e8");
      handle(sx(b), sy(island.localHeight(b)), "#4fb6e8");
    }
    if (trail) {
      ctx.strokeStyle = "rgba(214,69,69,.75)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      trail.pts.forEach(([x, y], i) => i ? ctx.lineTo(sx(x), sy(y)) : ctx.moveTo(sx(x), sy(y)));
      ctx.stroke();
      ctx.setLineDash([]);
      if (trail.caughtX !== null) {
        ctx.fillStyle = "#d64545";
        ctx.fillRect(sx(trail.caughtX) - 2, 0, 4, H());
        ctx.fillText("caught", sx(trail.caughtX) + 4, 28);
      }
    }
    pts.forEach(([x, y], i) => {
      ctx.fillStyle = isSel("point", i) ? "#ff9a2e" : i === pts.length - 1 ? "#ffc933" : "#1e2350";
      ctx.beginPath();
      ctx.arc(sx(x), sy(y), 6, 0, 7);
      ctx.fill();
    });
    for (const [i, g] of (lv.geysers || []).entries()) {
      ctx.fillStyle = isSel("geyser", i) ? "#ff9a2e" : "#9a6e6a";
      const y = sy(island.localHeight(g.x));
      ctx.fillRect(sx(g.x) - 7, y - 14, 14, 14);
    }
    for (const [i, r] of (lv.rings || []).entries()) {
      ctx.strokeStyle = isSel("ring", i) ? "#ff9a2e" : "#62e0c4";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(sx(r.x), sy(r.y), (r.r || 90) * view.s * 0.5, (r.r || 90) * view.s, 0, 0, 7);
      ctx.stroke();
    }
    for (const [i, d] of (lv.decor || []).entries()) {
      const y = sy(island.localHeight(d.x));
      ctx.fillStyle = isSel("decor", i) ? "#ff9a2e" : "#2f8f6b";
      ctx.beginPath();
      ctx.moveTo(sx(d.x), y - 18);
      ctx.lineTo(sx(d.x) - 6, y);
      ctx.lineTo(sx(d.x) + 6, y);
      ctx.fill();
      if (view.s > 0.18) {
        ctx.fillStyle = "#1e2350";
        ctx.fillText(d.type, sx(d.x) - 10, y - 22);
      }
    }
    for (const f of island.fish) {
      ctx.fillStyle = f.gold ? "#ffc933" : "#6ab7f0";
      ctx.beginPath();
      ctx.ellipse(sx(f.x), sy(f.y), 6, 4, 0, 0, 7);
      ctx.fill();
    }
    for (const [i, f] of (lv.fish || []).entries()) {
      const hy = f.type === "ground" ? island.localHeight(f.x) + (f.off || 46) : f.y;
      handle(sx(f.x), sy(hy), isSel("fish", i) ? "#ff9a2e" : "rgba(30,35,80,.35)", 4);
    }
  }
  function handle(x, y, c, r = 5) {
    ctx.strokeStyle = c;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - r, y - r, r * 2, r * 2);
  }
  function isSel(kind, i) {
    return sel && sel.kind === kind && sel.i === i;
  }
  function pick(px, py) {
    const lv = level();
    const near = (x2, y2, r = 10) => Math.hypot(sx(x2) - px, sy(y2) - py) < r;
    for (let i = 0; i < lv.points.length; i++) if (near(lv.points[i][0], lv.points[i][1])) return { kind: "point", i };
    for (let i = 0; i < (lv.fish || []).length; i++) {
      const f = lv.fish[i];
      const hy = f.type === "ground" ? island.localHeight(f.x) + (f.off || 46) : f.y;
      if (near(f.x, hy, 9)) return { kind: "fish", i };
    }
    for (let i = 0; i < (lv.ice || []).length; i++) {
      const [a, b] = lv.ice[i];
      if (near(a, island.localHeight(a))) return { kind: "ice", i, part: 0 };
      if (near(b, island.localHeight(b))) return { kind: "ice", i, part: 1 };
    }
    for (let i = 0; i < (lv.rings || []).length; i++) if (near(lv.rings[i].x, lv.rings[i].y, 16)) return { kind: "ring", i };
    for (let i = 0; i < (lv.geysers || []).length; i++) if (near(lv.geysers[i].x, island.localHeight(lv.geysers[i].x) + 20, 12)) return { kind: "geyser", i };
    for (let i = 0; i < (lv.decor || []).length; i++) if (near(lv.decor[i].x, island.localHeight(lv.decor[i].x) + 30, 14)) return { kind: "decor", i };
    const x = wx(px), y = wy(py);
    for (let i = 0; i < (lv.wind || []).length; i++) {
      const w = lv.wind[i];
      const gy = island.localHeight(w.x + w.w / 2);
      if (x >= w.x && x <= w.x + w.w && y >= gy && y <= gy + w.h) return { kind: "wind", i };
    }
    return null;
  }
  function arr(lv, key) {
    return lv[key] || (lv[key] = []);
  }
  cv.addEventListener("pointerdown", (e) => {
    const r = cv.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    const lv = level();
    const x = Math.round(wx(px)), y = Math.round(wy(py));
    const hit = pick(px, py);
    if (tool === "delete") {
      if (hit) {
        removeSel(hit);
        changed();
      }
      return;
    }
    if (tool !== "select" && !hit) {
      const gy = island.localHeight(x);
      if (tool === "point") {
        const idx = lv.points.findIndex((p) => p[0] > x);
        if (idx > 0) lv.points.splice(idx, 0, [x, y]);
        sel = { kind: "point", i: idx };
      } else if (tool === "fish" || tool === "gold") {
        arr(lv, "fish").push({ type: "single", x, y: Math.max(y, gy + 40), gold: tool === "gold" });
        sel = { kind: "fish", i: lv.fish.length - 1 };
      } else if (tool === "arc") {
        arr(lv, "fish").push({ type: "arc", x, y: Math.max(y, gy + 60), w: 500, h: 180, n: 7 });
        sel = { kind: "fish", i: lv.fish.length - 1 };
      } else if (tool === "ground") {
        arr(lv, "fish").push({ type: "ground", x, n: 5, spacing: 90, off: 52 });
        sel = { kind: "fish", i: lv.fish.length - 1 };
      } else if (tool === "ice") {
        arr(lv, "ice").push([x, x + 400]);
        sel = { kind: "ice", i: lv.ice.length - 1, part: 1 };
      } else if (tool === "wind") {
        arr(lv, "wind").push({ x: x - 160, w: 320, h: 1500, power: 1 });
        sel = { kind: "wind", i: lv.wind.length - 1 };
      } else if (tool === "geyser") {
        arr(lv, "geysers").push({ x });
        sel = { kind: "geyser", i: lv.geysers.length - 1 };
      } else if (tool === "ring") {
        arr(lv, "rings").push({ x, y, r: 100 });
        sel = { kind: "ring", i: lv.rings.length - 1 };
      } else if (tool === "decor") {
        arr(lv, "decor").push({ type: "pine", x, s: 1, v: 0 });
        sel = { kind: "decor", i: lv.decor.length - 1 };
      }
      changed();
      renderProps();
      return;
    }
    sel = hit;
    renderProps();
    drag = { px, py, hit, vx: view.x, vy: view.y };
    cv.setPointerCapture(e.pointerId);
    draw();
  });
  cv.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const r = cv.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    const lv = level();
    const x = Math.round(wx(px)), y = Math.round(wy(py));
    const h = drag.hit;
    if (!h) {
      view.x = drag.vx - (px - drag.px) / view.s;
      view.y = drag.vy + (py - drag.py) / view.s;
      draw();
      return;
    }
    if (h.kind === "point") {
      const p = lv.points;
      const lo = h.i > 0 ? p[h.i - 1][0] + 60 : 0, hi = h.i < p.length - 1 ? p[h.i + 1][0] - 60 : 1e9;
      p[h.i] = [h.i === 0 ? 0 : Math.max(lo, Math.min(hi, x)), y];
    } else if (h.kind === "fish") {
      const f = lv.fish[h.i];
      f.x = x;
      if (f.type !== "ground") f.y = y;
    } else if (h.kind === "ice") {
      lv.ice[h.i][h.part] = x;
      lv.ice[h.i].sort((a, b) => a - b);
    } else if (h.kind === "wind") {
      lv.wind[h.i].x = x - lv.wind[h.i].w / 2;
    } else if (h.kind === "geyser") lv.geysers[h.i].x = x;
    else if (h.kind === "ring") {
      lv.rings[h.i].x = x;
      lv.rings[h.i].y = y;
    } else if (h.kind === "decor") lv.decor[h.i].x = x;
    rebuild();
    draw();
  });
  cv.addEventListener("pointerup", () => {
    if (drag && drag.hit) {
      changed();
      renderProps();
    }
    drag = null;
  });
  cv.addEventListener("wheel", (e) => {
    e.preventDefault();
    const r = cv.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    const bx = wx(px), by = wy(py);
    view.s = Math.max(0.03, Math.min(2, view.s * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
    view.x = bx - px / view.s;
    view.y = by - (H() - py) / view.s;
    draw();
  }, { passive: false });
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    if ((e.key === "Delete" || e.key === "Backspace") && sel) {
      removeSel(sel);
      changed();
    }
    if (e.key === "v") runValidate();
  });
  function removeSel(h) {
    const lv = level();
    if (h.kind === "point") {
      if (h.i > 0 && lv.points.length > 4) lv.points.splice(h.i, 1);
    } else if (h.kind === "fish") lv.fish.splice(h.i, 1);
    else if (h.kind === "ice") lv.ice.splice(h.i, 1);
    else if (h.kind === "wind") lv.wind.splice(h.i, 1);
    else if (h.kind === "geyser") lv.geysers.splice(h.i, 1);
    else if (h.kind === "ring") lv.rings.splice(h.i, 1);
    else if (h.kind === "decor") lv.decor.splice(h.i, 1);
    sel = null;
    renderProps();
  }
  function renderList() {
    const el = $("list");
    el.innerHTML = "";
    const tools = document.createElement("div");
    tools.className = "tools";
    const mk = (label, fn) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.onclick = fn;
      tools.appendChild(b);
    };
    mk("+ \uC0C8 \uB808\uBCA8", () => {
      const base = JSON.parse(JSON.stringify(level()));
      base.id = "island" + String(levels.length + 1).padStart(2, "0");
      base.name = { ko: "\uC0C8 \uC12C", en: "New Island" };
      levels.push(base);
      cur = levels.length - 1;
      changed();
      renderProps();
    });
    mk("\uBCF5\uC81C", () => {
      const c = JSON.parse(JSON.stringify(level()));
      c.id += "_copy";
      levels.splice(cur + 1, 0, c);
      cur++;
      changed();
      renderProps();
    });
    mk("\uC0AD\uC81C", () => {
      if (levels.length > 1 && confirm("delete " + level().id + "?")) {
        levels.splice(cur, 1);
        cur = Math.max(0, cur - 1);
        changed();
        renderProps();
      }
    });
    mk("\u25B2", () => {
      if (cur > 0) {
        [levels[cur - 1], levels[cur]] = [levels[cur], levels[cur - 1]];
        cur--;
        changed();
      }
    });
    mk("\u25BC", () => {
      if (cur < levels.length - 1) {
        [levels[cur + 1], levels[cur]] = [levels[cur], levels[cur + 1]];
        cur++;
        changed();
      }
    });
    mk("\uC6D0\uBCF8\uC73C\uB85C", () => {
      if (confirm("discard drafts and reload shipped levels?")) {
        localStorage.removeItem(DRAFTS);
        levels = LEVELS.map((l) => JSON.parse(JSON.stringify(l)));
        cur = 0;
        changed();
        renderProps();
      }
    });
    el.appendChild(tools);
    levels.forEach((lv, i) => {
      var _a;
      const it = document.createElement("div");
      it.className = "item" + (i === cur ? " sel" : "");
      const r = results[i];
      const len = Math.round(lv.points[lv.points.length - 1][0] / balance_default.display.unitsPerMeter);
      it.innerHTML = `<span class="dot ${r ? r.ok ? "ok" : "bad" : ""}"></span><div><b>${i + 1}. ${((_a = lv.name) == null ? void 0 : _a.ko) || lv.id}</b><br><small>${lv.id} \xB7 ${lv.biome} \xB7 ${len}m</small></div>`;
      it.onclick = () => {
        cur = i;
        sel = null;
        rebuild();
        fitView();
        renderList();
        renderProps();
        draw();
      };
      el.appendChild(it);
    });
  }
  function input(label, value, onchange, type = "text", opts = null) {
    const l = document.createElement("label");
    l.append(document.createTextNode(label));
    let inp;
    if (opts) {
      inp = document.createElement("select");
      for (const o of opts) {
        const op = document.createElement("option");
        op.value = o;
        op.textContent = o;
        if (o === value) op.selected = true;
        inp.appendChild(op);
      }
    } else {
      inp = document.createElement("input");
      inp.type = type;
      if (type === "checkbox") inp.checked = !!value;
      else inp.value = value != null ? value : "";
    }
    inp.onchange = () => {
      onchange(type === "number" ? +inp.value : type === "checkbox" ? inp.checked : inp.value);
      changed();
    };
    l.appendChild(inp);
    return l;
  }
  function renderProps() {
    var _a, _b, _c;
    const el = $("props");
    const lv = level();
    el.innerHTML = "<h3>\uB808\uBCA8 \uC18D\uC131</h3>";
    el.append(
      input("id", lv.id, (v) => {
        lv.id = v;
      }),
      input("\uC774\uB984 (ko)", (_a = lv.name) == null ? void 0 : _a.ko, (v) => {
        lv.name.ko = v;
      }),
      input("name (en)", (_b = lv.name) == null ? void 0 : _b.en, (v) => {
        lv.name.en = v;
      }),
      input("biome", lv.biome, (v) => {
        lv.biome = v;
      }, "text", BIOMES),
      input("surface", lv.surface || "snow", (v) => {
        lv.surface = v;
      }, "text", ["snow", "cloud"]),
      input("intro", lv.intro || "", (v) => {
        lv.intro = v || null;
      }, "text", ["", "ice", "wind", "geyser", "ring", "cloud"])
    );
    el.insertAdjacentHTML("beforeend", "<h3>\uB208\uBCF4\uB77C Blizzard</h3>");
    lv.blizzard = lv.blizzard || { startGap: 1200, speed: 700, accel: 6 };
    for (const k of ["speed", "accel", "startGap"]) el.append(input(k, lv.blizzard[k], (v) => {
      lv.blizzard[k] = v;
    }, "number"));
    el.insertAdjacentHTML("beforeend", "<h3>\uC608\uC0C1 \uAC15\uD654 Expected upgrades (\uAC80\uC99D\uC6A9)</h3>");
    lv.expect = lv.expect || { upgrades: {} };
    for (const k of ["flap", "slide", "magnet", "glide", "scarf"]) el.append(input(k, lv.expect.upgrades[k] || 0, (v) => {
      lv.expect.upgrades[k] = v;
    }, "number"));
    el.insertAdjacentHTML("beforeend", "<h3>\uC12C \uBAA9\uD45C Goals</h3>");
    (lv.goals || []).forEach((g, gi) => {
      el.append(input("goal " + (gi + 1) + " type", g.type, (v) => {
        g.type = v;
      }, "text", ["fish", "perfect", "height", "gold", "fever", "rings"]));
      el.append(input("goal " + (gi + 1) + " n", g.n, (v) => {
        g.n = v;
      }, "number"));
    });
    if (!sel) {
      el.insertAdjacentHTML("beforeend", "<h3>\uC120\uD0DD \uC5C6\uC74C</h3><p>\uC810/\uBB3C\uACE0\uAE30/\uC624\uBE0C\uC81D\uD2B8\uB97C \uD074\uB9AD\uD558\uC138\uC694. \uBE48 \uACF3 \uB4DC\uB798\uADF8 = \uD654\uBA74 \uC774\uB3D9, \uD720 = \uD655\uB300.</p>");
      return;
    }
    el.insertAdjacentHTML("beforeend", `<h3>\uC120\uD0DD: ${sel.kind} #${sel.i}</h3>`);
    if (sel.kind === "point") {
      const p = lv.points[sel.i];
      el.append(input("x", p[0], (v) => {
        p[0] = v;
      }, "number"), input("y", p[1], (v) => {
        p[1] = v;
      }, "number"));
    } else if (sel.kind === "fish") {
      const f = lv.fish[sel.i];
      el.append(input("type", f.type, (v) => {
        f.type = v;
      }, "text", ["single", "arc", "line", "ground"]));
      for (const k of ["x", "y", "w", "h", "n", "x2", "y2", "spacing", "off"]) if (f[k] !== void 0 || k === "n" && f.type !== "single") el.append(input(k, (_c = f[k]) != null ? _c : "", (v) => {
        f[k] = v;
      }, "number"));
      el.append(input("gold", f.gold, (v) => {
        f.gold = v;
      }, "checkbox"));
    } else if (sel.kind === "wind") {
      const w = lv.wind[sel.i];
      for (const k of ["x", "w", "h", "power"]) el.append(input(k, w[k], (v) => {
        w[k] = v;
      }, "number"));
    } else if (sel.kind === "ring") {
      const r = lv.rings[sel.i];
      for (const k of ["x", "y", "r"]) el.append(input(k, r[k], (v) => {
        r[k] = v;
      }, "number"));
    } else if (sel.kind === "decor") {
      const d = lv.decor[sel.i];
      el.append(input("type", d.type, (v) => {
        d.type = v;
      }, "text", DECOR), input("x", d.x, (v) => {
        d.x = v;
      }, "number"), input("scale", d.s || 1, (v) => {
        d.s = v;
      }, "number"), input("variant", d.v || 0, (v) => {
        d.v = v;
      }, "number"));
    } else if (sel.kind === "geyser") {
      el.append(input("x", lv.geysers[sel.i].x, (v) => {
        lv.geysers[sel.i].x = v;
      }, "number"));
    } else if (sel.kind === "ice") {
      el.append(input("from", lv.ice[sel.i][0], (v) => {
        lv.ice[sel.i][0] = v;
      }, "number"), input("to", lv.ice[sel.i][1], (v) => {
        lv.ice[sel.i][1] = v;
      }, "number"));
    }
  }
  function renderToolbar() {
    const el = $("toolbar");
    el.innerHTML = "";
    for (const [k, label] of TOOLS) {
      const b = document.createElement("button");
      b.textContent = label;
      b.className = tool === k ? "on" : "";
      b.onclick = () => {
        tool = k;
        renderToolbar();
        $("hint").textContent = hintFor(k);
      };
      el.appendChild(b);
    }
  }
  function hintFor(k) {
    return { select: "\uD074\uB9AD: \uC120\uD0DD \xB7 \uB4DC\uB798\uADF8: \uC774\uB3D9 \xB7 \uBE48 \uACF3 \uB4DC\uB798\uADF8: \uD654\uBA74 \uC774\uB3D9 \xB7 \uD720: \uD655\uB300 \xB7 Del: \uC0AD\uC81C \xB7 V: \uAC80\uC99D", point: "\uBE48 \uACF3\uC744 \uD074\uB9AD\uD558\uBA74 \uADF8 x \uC704\uCE58\uC5D0 \uC5B8\uB355 \uC810\uC774 \uCD94\uAC00\uB3FC\uC694" }[k] || "\uBE48 \uACF3\uC744 \uD074\uB9AD\uD574\uC11C \uCD94\uAC00\uD574\uC694";
  }
  function fitView() {
    const lv = level();
    const L = lv.points[lv.points.length - 1][0];
    view.s = Math.max(0.03, (W() - 40) / (L + 400));
    view.x = -200;
    const ys = lv.points.map((p) => p[1]);
    const mid = (Math.min(...ys) + Math.max(...ys)) / 2 + 300;
    view.y = mid - H() / 2 / view.s;
  }
  function log(html) {
    $("out").innerHTML = html;
  }
  function runValidate() {
    const lv = level();
    const st = checkStructure(lv);
    let html = `<b>${lv.id}</b> structure: ${st.errors.length ? '<span class="bad">' + st.errors.length + " errors</span>" : '<span class="ok">ok</span>'}
`;
    for (const e of st.errors) html += `<span class="bad">  \u2717 ${e}</span>
`;
    for (const w of st.warnings) html += `<span class="warn">  ! ${w}</span>
`;
    const t0 = performance.now();
    const r = checkClearable(levels, cur, balance_default, { seeds: 5 });
    html += `clearability (expected upgrades ${JSON.stringify(r.upgrades)}): ${r.pass ? '<span class="ok">PASS</span>' : '<span class="bad">FAIL</span>'}  (${Math.round(performance.now() - t0)} ms)
`;
    html += `length ${r.lengthM} m \xB7 fish available ${r.fishAvailable}
`;
    for (const [p, v] of Object.entries(r.profiles)) {
      html += `  ${p.padEnd(8)} clear ${Math.round(v.clearRate * 100)}% \xB7 progress ${Math.round(v.avgProgress * 100)}% \xB7 ${v.avgTime.toFixed(1)}s \xB7 fish ${v.avgFish.toFixed(0)} \xB7 perfect ${v.avgPerfect.toFixed(1)} \xB7 bonk ${v.avgBonk.toFixed(1)} \xB7 max height ${v.avgMaxHeightM.toFixed(0)}m
`;
    }
    for (const n of r.notes) html += `<span class="warn">  \xB7 ${n}</span>
`;
    results[cur] = { ok: st.errors.length === 0 && r.pass };
    const sim = new RunSim({ levels: levels.slice(0, cur + 1), balance: balance_default, upgrades: r.upgrades, startIndex: cur });
    const bot = makeBot("good", 3);
    const pts = [];
    let caughtX = null;
    while (sim.state === "run" && sim.time < 300) {
      sim.step(1 / 120, bot(sim));
      if ((sim.time * 120 | 0) % 6 === 0) pts.push([sim.p.x - sim.island.startX, sim.p.y]);
    }
    if (sim.state === "caught") caughtX = sim.p.x - sim.island.startX;
    trail = { pts, caughtX };
    log(html);
    renderList();
    draw();
  }
  function testPlay() {
    try {
      localStorage.setItem("ps.editorLevel", JSON.stringify(level()));
    } catch (e) {
    }
    $("frame").src = "../dev/index.html?editorLevel=1&t=" + Date.now();
    $("play").classList.add("show");
  }
  function download(name, data) {
    const blob = new Blob([JSON.stringify(data, null, 1) + "\n"], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2e3);
  }
  $("bValidate").onclick = runValidate;
  $("bPlay").onclick = testPlay;
  $("bClose").onclick = () => {
    $("play").classList.remove("show");
    $("frame").src = "about:blank";
  };
  $("bExport").onclick = () => download(level().id + ".json", level());
  $("bExportAll").onclick = () => levels.forEach((lv, i) => setTimeout(() => download(`island${String(i + 1).padStart(2, "0")}.json`, lv), i * 250));
  $("bImport").onclick = () => $("file").click();
  $("file").onchange = async (e) => {
    for (const f of e.target.files) {
      try {
        const data = JSON.parse(await f.text());
        const list = Array.isArray(data) ? data : [data];
        for (const lv of list) {
          if (!lv.points) continue;
          const i = levels.findIndex((l) => l.id === lv.id);
          if (i >= 0) levels[i] = lv;
          else levels.push(lv);
          cur = i >= 0 ? i : levels.length - 1;
        }
      } catch (err) {
        alert(f.name + ": " + err.message);
      }
    }
    e.target.value = "";
    changed();
    renderProps();
    fitView();
    draw();
  };
  window.addEventListener("resize", resize);
  renderToolbar();
  renderList();
  rebuild();
  resize();
  fitView();
  renderProps();
  draw();
  $("hint").textContent = hintFor("select");
  log("\uB808\uBCA8\uC744 \uACE0\uB974\uACE0 \uD3B8\uC9D1\uD558\uC138\uC694. [\uAC80\uC99D]\uC740 \uAD6C\uC870 \uAC80\uC0AC + \uBD07 \uD50C\uB808\uC774\uB85C \uD074\uB9AC\uC5B4 \uAC00\uB2A5 \uC5EC\uBD80\uB97C \uD655\uC778\uD569\uB2C8\uB2E4. \uD3B8\uC9D1 \uB0B4\uC6A9\uC740 \uBE0C\uB77C\uC6B0\uC800\uC5D0 \uC790\uB3D9 \uC800\uC7A5\uB418\uACE0, [\uB0B4\uBCF4\uB0B4\uAE30]\uB85C JSON \uD30C\uC77C\uC744 \uBC1B\uC544 src/data/levels/ \uC5D0 \uB123\uC73C\uBA74 \uAC8C\uC784\uC5D0 \uBC18\uC601\uB429\uB2C8\uB2E4.");
  window.__editor = { levels: () => levels, select: (i) => {
    cur = i;
    rebuild();
    fitView();
    renderList();
    renderProps();
    draw();
  }, validate: runValidate };
})();
