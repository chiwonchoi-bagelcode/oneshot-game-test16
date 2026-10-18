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
      airDrag: 5e-5,
      groundDrag: 14e-5,
      minSpeed: 260,
      maxSpeed: 2300,
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
      ],
      bonkFloor: 0.32
    },
    upgrades: {
      flap: {
        order: 1,
        maxLevel: 10,
        baseCost: 20,
        costGrowth: 2.25,
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
        baseCost: 30,
        costGrowth: 2.25,
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
        costGrowth: 2.1,
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
        baseCost: 120,
        costGrowth: 2.15,
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
        baseCost: 300,
        costGrowth: 2.4,
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
      rubberBandMul: 2.2,
      tutorialDelay: 9,
      warmup: 10,
      startHold: 2,
      maxGapSec: 2.4,
      dangerSec: 0.85,
      startGapSec: 2.1,
      feverPushSec: 1
    },
    economy: {
      fishValue: 1,
      goldFishValue: 8,
      distanceFishPerMeter: 0.01,
      islandFirstBonus: [
        0,
        0,
        30,
        50,
        80,
        110,
        150,
        190,
        240,
        300,
        0
      ],
      islandRepeatBonus: 0.15,
      populationBonusPerPenguin: 0.01,
      endlessIslandBonus: 40
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
        type: "ground",
        x: 120,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 1191,
        y: 286,
        soar: 1
      },
      {
        type: "ground",
        x: 1265,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 1412,
        y: 292,
        soar: 1
      },
      {
        type: "single",
        x: 1494,
        y: 427,
        soar: 1
      },
      {
        type: "single",
        x: 1616,
        y: 438,
        soar: 1
      },
      {
        type: "single",
        x: 1631,
        y: 189,
        soar: 1
      },
      {
        type: "single",
        x: 1738,
        y: 425,
        soar: 1
      },
      {
        type: "single",
        x: 1803,
        y: 42,
        soar: 1
      },
      {
        type: "single",
        x: 1859,
        y: 389,
        soar: 1
      },
      {
        type: "single",
        x: 2051,
        y: 283,
        soar: 1
      },
      {
        type: "single",
        x: 2151,
        y: 739
      },
      {
        type: "single",
        x: 2266,
        y: 619
      },
      {
        type: "single",
        x: 2379,
        y: 469
      },
      {
        type: "ground",
        x: 2474,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 2492,
        y: 307
      },
      {
        type: "ground",
        x: 3646,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 3652,
        y: 454
      },
      {
        type: "single",
        x: 3732,
        y: 529
      },
      {
        type: "single",
        x: 3813,
        y: 598
      },
      {
        type: "single",
        x: 3892,
        y: 656
      },
      {
        type: "single",
        x: 3972,
        y: 704
      },
      {
        type: "single",
        x: 4051,
        y: 747
      },
      {
        type: "single",
        x: 4130,
        y: 786
      },
      {
        type: "single",
        x: 5269,
        y: 930
      },
      {
        type: "single",
        x: 5344,
        y: 908
      },
      {
        type: "single",
        x: 5419,
        y: 874
      },
      {
        type: "single",
        x: 5493,
        y: 830
      },
      {
        type: "single",
        x: 5567,
        y: 774
      },
      {
        type: "single",
        x: 5641,
        y: 707
      },
      {
        type: "single",
        x: 5715,
        y: 629
      },
      {
        type: "single",
        x: 5978,
        y: 295
      },
      {
        type: "single",
        x: 6063,
        y: 257
      },
      {
        type: "single",
        x: 6147,
        y: 175
      },
      {
        type: "single",
        x: 6231,
        y: 48
      },
      {
        type: "single",
        x: 6314,
        y: -113
      },
      {
        type: "single",
        x: 7074,
        y: 225
      },
      {
        type: "single",
        x: 7160,
        y: 331
      },
      {
        type: "single",
        x: 7246,
        y: 433
      },
      {
        type: "ground",
        x: 7292,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 7332,
        y: 530
      },
      {
        type: "single",
        x: 7417,
        y: 624
      },
      {
        type: "single",
        x: 7502,
        y: 712
      },
      {
        type: "single",
        x: 7586,
        y: 797
      },
      {
        type: "single",
        x: 8728,
        y: 1482
      },
      {
        type: "single",
        x: 8807,
        y: 1479
      },
      {
        type: "single",
        x: 8886,
        y: 1464
      },
      {
        type: "single",
        x: 8965,
        y: 1439
      },
      {
        type: "single",
        x: 9043,
        y: 1402
      },
      {
        type: "single",
        x: 9121,
        y: 1353
      },
      {
        type: "single",
        x: 9191,
        y: 79
      },
      {
        type: "single",
        x: 9199,
        y: 1294
      },
      {
        type: "single",
        x: 9275,
        y: 87
      },
      {
        type: "single",
        x: 9359,
        y: 80
      },
      {
        type: "single",
        x: 9443,
        y: 58
      },
      {
        type: "single",
        x: 9526,
        y: 22
      },
      {
        type: "ground",
        x: 9824,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 10845,
        y: 189
      },
      {
        type: "single",
        x: 10920,
        y: 286
      },
      {
        type: "single",
        x: 10995,
        y: 377
      },
      {
        type: "single",
        x: 11069,
        y: 457
      },
      {
        type: "single",
        x: 11143,
        y: 526
      },
      {
        type: "single",
        x: 11217,
        y: 582
      },
      {
        type: "single",
        x: 11290,
        y: 628
      },
      {
        type: "single",
        x: 13219,
        y: 238
      },
      {
        type: "single",
        x: 13304,
        y: 360
      },
      {
        type: "single",
        x: 13388,
        y: 478
      },
      {
        type: "single",
        x: 13471,
        y: 587
      },
      {
        type: "single",
        x: 13555,
        y: 684
      },
      {
        type: "single",
        x: 13637,
        y: 769
      },
      {
        type: "single",
        x: 13719,
        y: 842
      },
      {
        type: "arc",
        x: 15088,
        y: 896,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "ground",
        x: 15128,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 16301,
        y: 368
      },
      {
        type: "single",
        x: 16389,
        y: 386
      },
      {
        type: "single",
        x: 16476,
        y: 388
      },
      {
        type: "single",
        x: 16564,
        y: 374
      },
      {
        type: "single",
        x: 16651,
        y: 346
      },
      {
        type: "single",
        x: 16737,
        y: 303
      },
      {
        type: "single",
        x: 16823,
        y: 245
      },
      {
        type: "single",
        x: 17438,
        y: 319
      },
      {
        type: "single",
        x: 17535,
        y: 419
      },
      {
        type: "single",
        x: 17631,
        y: 502
      },
      {
        type: "single",
        x: 17727,
        y: 570
      },
      {
        type: "single",
        x: 17822,
        y: 623
      },
      {
        type: "single",
        x: 17917,
        y: 661
      },
      {
        type: "single",
        x: 18011,
        y: 684
      }
    ],
    blizzard: {
      speed: 430,
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
        x: 150
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
        7183,
        -445
      ],
      [
        8103,
        285
      ],
      [
        8446,
        -137
      ],
      [
        8805,
        39
      ],
      [
        9144,
        -188
      ],
      [
        9483,
        35
      ],
      [
        10092,
        -376
      ],
      [
        10673,
        161
      ],
      [
        11289,
        -351
      ],
      [
        11915,
        185
      ],
      [
        12573,
        -348
      ],
      [
        13174,
        142
      ],
      [
        14102,
        -455
      ],
      [
        15085,
        319
      ],
      [
        15680,
        -367
      ],
      [
        16317,
        156
      ],
      [
        16956,
        -339
      ],
      [
        17638,
        139
      ],
      [
        18278,
        -200
      ],
      [
        19098,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 2099,
        y: 729
      },
      {
        type: "single",
        x: 2182,
        y: 679
      },
      {
        type: "single",
        x: 2265,
        y: 617
      },
      {
        type: "single",
        x: 2360,
        y: 296,
        soar: 1
      },
      {
        type: "single",
        x: 2457,
        y: 388,
        soar: 1
      },
      {
        type: "single",
        x: 2553,
        y: 464,
        soar: 1
      },
      {
        type: "single",
        x: 2744,
        y: 571,
        soar: 1
      },
      {
        type: "single",
        x: 2862,
        y: 607,
        soar: 1
      },
      {
        type: "single",
        x: 2895,
        y: 749,
        soar: 1
      },
      {
        type: "single",
        x: 3006,
        y: 798,
        soar: 1
      },
      {
        type: "single",
        x: 3096,
        y: 607,
        soar: 1
      },
      {
        type: "single",
        x: 3212,
        y: 573,
        soar: 1
      },
      {
        type: "single",
        x: 3226,
        y: 842,
        soar: 1
      },
      {
        type: "single",
        x: 3328,
        y: 515,
        soar: 1
      },
      {
        type: "single",
        x: 3444,
        y: 767,
        soar: 1
      },
      {
        type: "single",
        x: 3511,
        y: 375,
        soar: 1
      },
      {
        type: "single",
        x: 3552,
        y: 681,
        soar: 1
      },
      {
        type: "ground",
        x: 3738,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 3937,
        y: 705
      },
      {
        type: "single",
        x: 4015,
        y: 758
      },
      {
        type: "single",
        x: 4092,
        y: 799
      },
      {
        type: "single",
        x: 4169,
        y: 829
      },
      {
        type: "single",
        x: 4246,
        y: 847
      },
      {
        type: "single",
        x: 4322,
        y: 855
      },
      {
        type: "single",
        x: 4398,
        y: 851
      },
      {
        type: "single",
        x: 6119,
        y: 267
      },
      {
        type: "single",
        x: 6255,
        y: 525
      },
      {
        type: "single",
        x: 6390,
        y: 764
      },
      {
        type: "single",
        x: 6523,
        y: 986
      },
      {
        type: "single",
        x: 6655,
        y: 1191
      },
      {
        type: "single",
        x: 6785,
        y: 1367
      },
      {
        type: "single",
        x: 6915,
        y: 1496
      },
      {
        type: "arc",
        x: 8183,
        y: 925,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 8890,
        y: 138
      },
      {
        type: "single",
        x: 8990,
        y: 184
      },
      {
        type: "single",
        x: 9091,
        y: 215
      },
      {
        type: "single",
        x: 9190,
        y: 231
      },
      {
        type: "single",
        x: 9290,
        y: 232
      },
      {
        type: "single",
        x: 9388,
        y: 203
      },
      {
        type: "single",
        x: 9487,
        y: 142
      },
      {
        type: "single",
        x: 9853,
        y: 1003
      },
      {
        type: "single",
        x: 9959,
        y: 1072
      },
      {
        type: "single",
        x: 10066,
        y: 1136
      },
      {
        type: "single",
        x: 10171,
        y: 1190
      },
      {
        type: "single",
        x: 10276,
        y: 1232
      },
      {
        type: "single",
        x: 10381,
        y: 1263
      },
      {
        type: "single",
        x: 10485,
        y: 1282
      },
      {
        type: "single",
        x: 11903,
        y: 328
      },
      {
        type: "single",
        x: 12023,
        y: 470
      },
      {
        type: "single",
        x: 12143,
        y: 596
      },
      {
        type: "single",
        x: 12261,
        y: 705
      },
      {
        type: "single",
        x: 12379,
        y: 799
      },
      {
        type: "single",
        x: 12495,
        y: 877
      },
      {
        type: "single",
        x: 12611,
        y: 930
      },
      {
        type: "single",
        x: 13113,
        y: 266
      },
      {
        type: "single",
        x: 13194,
        y: 385
      },
      {
        type: "single",
        x: 13274,
        y: 500
      },
      {
        type: "single",
        x: 13353,
        y: 610
      },
      {
        type: "single",
        x: 13432,
        y: 716
      },
      {
        type: "single",
        x: 13511,
        y: 818
      },
      {
        type: "single",
        x: 13589,
        y: 914
      },
      {
        type: "single",
        x: 15041,
        y: 463
      },
      {
        type: "single",
        x: 15163,
        y: 578
      },
      {
        type: "arc",
        x: 15165,
        y: 959,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 15283,
        y: 677
      },
      {
        type: "single",
        x: 15403,
        y: 760
      },
      {
        type: "single",
        x: 15522,
        y: 828
      },
      {
        type: "single",
        x: 15640,
        y: 880
      },
      {
        type: "single",
        x: 15758,
        y: 915
      },
      {
        type: "single",
        x: 16218,
        y: 219
      },
      {
        type: "single",
        x: 16340,
        y: 387
      },
      {
        type: "single",
        x: 16471,
        y: 550
      },
      {
        type: "single",
        x: 16591,
        y: 685
      },
      {
        type: "single",
        x: 16710,
        y: 803
      },
      {
        type: "single",
        x: 16828,
        y: 905
      },
      {
        type: "single",
        x: 16946,
        y: 970
      },
      {
        type: "single",
        x: 17654,
        y: 307
      },
      {
        type: "single",
        x: 17728,
        y: 380
      },
      {
        type: "single",
        x: 17801,
        y: 450
      },
      {
        type: "single",
        x: 17873,
        y: 516
      },
      {
        type: "single",
        x: 17946,
        y: 577
      },
      {
        type: "single",
        x: 18017,
        y: 635
      },
      {
        type: "single",
        x: 18089,
        y: 688
      }
    ],
    blizzard: {
      speed: 500,
      accel: 6
    },
    expect: {
      upgrades: {
        flap: 1,
        slide: 1
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
        x: 150
      },
      {
        type: "rock",
        x: 700,
        s: 0.79,
        v: 1
      },
      {
        type: "rock",
        x: 1312,
        s: 0.92,
        v: 2
      },
      {
        type: "rock",
        x: 1799,
        s: 1.09,
        v: 2
      },
      {
        type: "rock",
        x: 2279,
        s: 0.77,
        v: 0
      },
      {
        type: "pine",
        x: 2743,
        s: 0.89,
        v: 1
      },
      {
        type: "pine",
        x: 3474,
        s: 0.97,
        v: 1
      },
      {
        type: "pine",
        x: 4020,
        s: 0.82,
        v: 1
      },
      {
        type: "pine",
        x: 4657,
        s: 1,
        v: 1
      },
      {
        type: "pine",
        x: 5229,
        s: 0.95,
        v: 0
      },
      {
        type: "pine",
        x: 5788,
        s: 0.87,
        v: 0
      },
      {
        type: "pine",
        x: 6497,
        s: 0.99,
        v: 1
      },
      {
        type: "pine",
        x: 6897,
        s: 0.95,
        v: 0
      },
      {
        type: "pine",
        x: 7350,
        s: 0.81,
        v: 1
      },
      {
        type: "pine",
        x: 7888,
        s: 0.83,
        v: 2
      },
      {
        type: "rock",
        x: 8483,
        s: 0.94,
        v: 2
      },
      {
        type: "rock",
        x: 9195,
        s: 0.95,
        v: 0
      },
      {
        type: "pine",
        x: 9791,
        s: 0.96,
        v: 0
      },
      {
        type: "rock",
        x: 10382,
        s: 1.07,
        v: 2
      },
      {
        type: "rock",
        x: 10897,
        s: 0.89,
        v: 0
      },
      {
        type: "rock",
        x: 11412,
        s: 0.93,
        v: 2
      },
      {
        type: "rock",
        x: 12169,
        s: 1.09,
        v: 2
      },
      {
        type: "rock",
        x: 12563,
        s: 0.76,
        v: 1
      },
      {
        type: "rock",
        x: 13006,
        s: 0.94,
        v: 0
      },
      {
        type: "pine",
        x: 13663,
        s: 0.88,
        v: 2
      },
      {
        type: "rock",
        x: 14285,
        s: 0.77,
        v: 2
      },
      {
        type: "pine",
        x: 14734,
        s: 1.03,
        v: 2
      },
      {
        type: "pine",
        x: 15388,
        s: 0.87,
        v: 0
      },
      {
        type: "pine",
        x: 16069,
        s: 0.97,
        v: 0
      },
      {
        type: "pine",
        x: 16613,
        s: 1.01,
        v: 0
      },
      {
        type: "pine",
        x: 17295,
        s: 1.09,
        v: 2
      },
      {
        type: "pine",
        x: 17952,
        s: 0.86,
        v: 0
      },
      {
        type: "snowman",
        x: 8594,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 19058
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
        type: "ground",
        x: 120,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 1375,
        y: 375
      },
      {
        type: "single",
        x: 1461,
        y: 387
      },
      {
        type: "single",
        x: 1546,
        y: 355
      },
      {
        type: "single",
        x: 1631,
        y: 277
      },
      {
        type: "single",
        x: 1715,
        y: 156
      },
      {
        type: "single",
        x: 1799,
        y: -10
      },
      {
        type: "single",
        x: 2217,
        y: 823
      },
      {
        type: "single",
        x: 2312,
        y: 786
      },
      {
        type: "single",
        x: 2485,
        y: 300,
        soar: 1
      },
      {
        type: "single",
        x: 2562,
        y: 396,
        soar: 1
      },
      {
        type: "single",
        x: 2713,
        y: 562,
        soar: 1
      },
      {
        type: "single",
        x: 2813,
        y: 652,
        soar: 1
      },
      {
        type: "single",
        x: 2913,
        y: 727,
        soar: 1
      },
      {
        type: "single",
        x: 3110,
        y: 831,
        soar: 1
      },
      {
        type: "single",
        x: 3232,
        y: 865,
        soar: 1
      },
      {
        type: "single",
        x: 3286,
        y: 1016,
        soar: 1
      },
      {
        type: "single",
        x: 3353,
        y: 875,
        soar: 1
      },
      {
        type: "single",
        x: 3474,
        y: 862,
        soar: 1
      },
      {
        type: "single",
        x: 3594,
        y: 826,
        soar: 1
      },
      {
        type: "single",
        x: 3784,
        y: 720,
        soar: 1
      },
      {
        type: "single",
        x: 3879,
        y: 645,
        soar: 1
      },
      {
        type: "single",
        x: 3972,
        y: 555,
        soar: 1
      },
      {
        type: "single",
        x: 4066,
        y: 451,
        soar: 1
      },
      {
        type: "single",
        x: 4237,
        y: 460
      },
      {
        type: "single",
        x: 4352,
        y: 392
      },
      {
        type: "single",
        x: 4467,
        y: 280
      },
      {
        type: "single",
        x: 4733,
        y: 1721
      },
      {
        type: "single",
        x: 4811,
        y: 1796
      },
      {
        type: "single",
        x: 4889,
        y: 1867
      },
      {
        type: "single",
        x: 4966,
        y: 1934
      },
      {
        type: "single",
        x: 5043,
        y: 1996
      },
      {
        type: "single",
        x: 5120,
        y: 2047
      },
      {
        type: "single",
        x: 5197,
        y: 2088
      },
      {
        type: "single",
        x: 6594,
        y: 1862
      },
      {
        type: "single",
        x: 6666,
        y: 1803
      },
      {
        type: "single",
        x: 6737,
        y: 1740
      },
      {
        type: "single",
        x: 6808,
        y: 1674
      },
      {
        type: "single",
        x: 6879,
        y: 1606
      },
      {
        type: "single",
        x: 6950,
        y: 1535
      },
      {
        type: "single",
        x: 7020,
        y: 1461
      },
      {
        type: "single",
        x: 7697,
        y: 353
      },
      {
        type: "single",
        x: 7820,
        y: 485
      },
      {
        type: "single",
        x: 7941,
        y: 600
      },
      {
        type: "single",
        x: 8062,
        y: 700
      },
      {
        type: "single",
        x: 8182,
        y: 783
      },
      {
        type: "single",
        x: 8301,
        y: 852
      },
      {
        type: "single",
        x: 8419,
        y: 904
      },
      {
        type: "single",
        x: 8886,
        y: 341
      },
      {
        type: "single",
        x: 8975,
        y: 464
      },
      {
        type: "single",
        x: 9064,
        y: 576
      },
      {
        type: "ground",
        x: 9086,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 9153,
        y: 684
      },
      {
        type: "single",
        x: 9241,
        y: 787
      },
      {
        type: "single",
        x: 9328,
        y: 886
      },
      {
        type: "single",
        x: 9415,
        y: 981
      },
      {
        type: "single",
        x: 10143,
        y: 336
      },
      {
        type: "single",
        x: 10258,
        y: 468
      },
      {
        type: "single",
        x: 10381,
        y: 593
      },
      {
        type: "single",
        x: 10494,
        y: 691
      },
      {
        type: "single",
        x: 10606,
        y: 774
      },
      {
        type: "single",
        x: 10718,
        y: 841
      },
      {
        type: "single",
        x: 10828,
        y: 893
      },
      {
        type: "single",
        x: 11154,
        y: 2037
      },
      {
        type: "single",
        x: 11233,
        y: 2044
      },
      {
        type: "single",
        x: 11312,
        y: 2048
      },
      {
        type: "single",
        x: 11391,
        y: 2048
      },
      {
        type: "single",
        x: 11470,
        y: 2045
      },
      {
        type: "single",
        x: 11548,
        y: 2038
      },
      {
        type: "ground",
        x: 11585,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 11626,
        y: 2029
      },
      {
        type: "single",
        x: 12761,
        y: 453
      },
      {
        type: "single",
        x: 12884,
        y: 617
      },
      {
        type: "single",
        x: 13006,
        y: 765
      },
      {
        type: "single",
        x: 13127,
        y: 896
      },
      {
        type: "single",
        x: 13247,
        y: 1011
      },
      {
        type: "single",
        x: 13366,
        y: 1104
      },
      {
        type: "single",
        x: 13485,
        y: 1153
      },
      {
        type: "single",
        x: 14040,
        y: 352
      },
      {
        type: "single",
        x: 14132,
        y: 491
      },
      {
        type: "single",
        x: 14223,
        y: 619
      },
      {
        type: "single",
        x: 14314,
        y: 740
      },
      {
        type: "single",
        x: 14404,
        y: 857
      },
      {
        type: "single",
        x: 14494,
        y: 968
      },
      {
        type: "single",
        x: 14583,
        y: 1076
      },
      {
        type: "single",
        x: 15585,
        y: 528
      },
      {
        type: "single",
        x: 15657,
        y: 622
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
        type: "single",
        x: 15728,
        y: 711
      },
      {
        type: "single",
        x: 15799,
        y: 796
      },
      {
        type: "single",
        x: 15870,
        y: 877
      },
      {
        type: "single",
        x: 15940,
        y: 954
      },
      {
        type: "single",
        x: 16079,
        y: 1095
      },
      {
        type: "single",
        x: 16361,
        y: 2377
      },
      {
        type: "single",
        x: 16442,
        y: 2395
      },
      {
        type: "single",
        x: 16523,
        y: 2410
      },
      {
        type: "single",
        x: 16603,
        y: 2421
      },
      {
        type: "single",
        x: 16683,
        y: 2428
      },
      {
        type: "single",
        x: 16763,
        y: 2431
      },
      {
        type: "single",
        x: 16843,
        y: 2431
      },
      {
        type: "single",
        x: 16955,
        y: 1625
      },
      {
        type: "single",
        x: 17086,
        y: 1649
      },
      {
        type: "single",
        x: 17216,
        y: 1657
      },
      {
        type: "single",
        x: 17346,
        y: 1650
      },
      {
        type: "single",
        x: 17474,
        y: 1629
      },
      {
        type: "single",
        x: 17602,
        y: 1593
      },
      {
        type: "single",
        x: 17729,
        y: 1527
      },
      {
        type: "single",
        x: 18238,
        y: 1285
      },
      {
        type: "single",
        x: 18311,
        y: 1142
      },
      {
        type: "single",
        x: 18384,
        y: 990
      },
      {
        type: "single",
        x: 18456,
        y: 829
      },
      {
        type: "single",
        x: 18527,
        y: 663
      },
      {
        type: "single",
        x: 18598,
        y: 496
      },
      {
        type: "single",
        x: 18669,
        y: 322
      },
      {
        type: "single",
        x: 19635,
        y: 480
      },
      {
        type: "single",
        x: 19711,
        y: 578
      },
      {
        type: "single",
        x: 19787,
        y: 672
      },
      {
        type: "single",
        x: 19862,
        y: 760
      },
      {
        type: "single",
        x: 19937,
        y: 837
      },
      {
        type: "single",
        x: 20011,
        y: 902
      },
      {
        type: "single",
        x: 20085,
        y: 955
      },
      {
        type: "single",
        x: 20402,
        y: 1349
      },
      {
        type: "single",
        x: 20503,
        y: 1412
      },
      {
        type: "single",
        x: 20604,
        y: 1471
      },
      {
        type: "single",
        x: 20704,
        y: 1527
      },
      {
        type: "single",
        x: 20804,
        y: 1578
      },
      {
        type: "single",
        x: 20904,
        y: 1625
      },
      {
        type: "single",
        x: 20952,
        y: 848
      },
      {
        type: "single",
        x: 21003,
        y: 1662
      },
      {
        type: "single",
        x: 21023,
        y: 779
      },
      {
        type: "single",
        x: 21162,
        y: 625
      },
      {
        type: "ground",
        x: 21162,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 21300,
        y: 430
      },
      {
        type: "single",
        x: 21436,
        y: 193
      },
      {
        type: "single",
        x: 22295,
        y: 514
      },
      {
        type: "single",
        x: 22394,
        y: 551
      },
      {
        type: "single",
        x: 22493,
        y: 561
      },
      {
        type: "single",
        x: 22591,
        y: 536
      },
      {
        type: "single",
        x: 22689,
        y: 496
      },
      {
        type: "single",
        x: 22786,
        y: 441
      },
      {
        type: "single",
        x: 22882,
        y: 372
      },
      {
        type: "single",
        x: 23174,
        y: 1336
      },
      {
        type: "single",
        x: 23264,
        y: 1286
      },
      {
        type: "single",
        x: 23353,
        y: 1232
      },
      {
        type: "single",
        x: 23442,
        y: 1175
      },
      {
        type: "single",
        x: 23531,
        y: 1116
      },
      {
        type: "single",
        x: 23619,
        y: 1048
      },
      {
        type: "single",
        x: 23707,
        y: 969
      },
      {
        type: "arc",
        x: 24117,
        y: 1195,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "ground",
        x: 24157,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 25365,
        y: 498
      },
      {
        type: "single",
        x: 25436,
        y: 584
      },
      {
        type: "single",
        x: 25506,
        y: 665
      },
      {
        type: "single",
        x: 25577,
        y: 738
      },
      {
        type: "single",
        x: 25647,
        y: 800
      },
      {
        type: "single",
        x: 25786,
        y: 902
      },
      {
        type: "single",
        x: 25924,
        y: 978
      },
      {
        type: "single",
        x: 26514,
        y: 341
      },
      {
        type: "single",
        x: 26584,
        y: 441
      },
      {
        type: "single",
        x: 26655,
        y: 538
      },
      {
        type: "single",
        x: 26725,
        y: 630
      },
      {
        type: "ground",
        x: 26727,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 26865,
        y: 802
      },
      {
        type: "single",
        x: 27003,
        y: 958
      },
      {
        type: "single",
        x: 27140,
        y: 1097
      },
      {
        type: "single",
        x: 27896,
        y: 410
      },
      {
        type: "single",
        x: 27968,
        y: 484
      },
      {
        type: "single",
        x: 28040,
        y: 554
      },
      {
        type: "single",
        x: 28112,
        y: 620
      },
      {
        type: "single",
        x: 28183,
        y: 682
      },
      {
        type: "single",
        x: 28254,
        y: 739
      },
      {
        type: "single",
        x: 28324,
        y: 793
      }
    ],
    blizzard: {
      speed: 640,
      accel: 6
    },
    expect: {
      upgrades: {
        flap: 2,
        slide: 2,
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
        x: 150
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
        x: 1109,
        y: 290,
        soar: 1
      },
      {
        type: "single",
        x: 1179,
        y: 390,
        soar: 1
      },
      {
        type: "single",
        x: 1260,
        y: 486,
        soar: 1
      },
      {
        type: "single",
        x: 1346,
        y: 577,
        soar: 1
      },
      {
        type: "single",
        x: 1538,
        y: 724,
        soar: 1
      },
      {
        type: "single",
        x: 1748,
        y: 812,
        soar: 1
      },
      {
        type: "single",
        x: 1957,
        y: 940,
        soar: 1
      },
      {
        type: "single",
        x: 2060,
        y: 1017,
        soar: 1
      },
      {
        type: "single",
        x: 2265,
        y: 1002,
        soar: 1
      },
      {
        type: "single",
        x: 2407,
        y: 826,
        soar: 1
      },
      {
        type: "single",
        x: 2468,
        y: 718,
        soar: 1
      },
      {
        type: "single",
        x: 2528,
        y: 602,
        soar: 1
      },
      {
        type: "single",
        x: 2588,
        y: 480,
        soar: 1
      },
      {
        type: "single",
        x: 2647,
        y: 352,
        soar: 1
      },
      {
        type: "single",
        x: 2706,
        y: 216,
        soar: 1
      },
      {
        type: "single",
        x: 2849,
        y: 1584
      },
      {
        type: "single",
        x: 3585,
        y: 466
      },
      {
        type: "ground",
        x: 3694,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 3714,
        y: 648
      },
      {
        type: "single",
        x: 3841,
        y: 812
      },
      {
        type: "single",
        x: 3968,
        y: 961
      },
      {
        type: "single",
        x: 4093,
        y: 1084
      },
      {
        type: "single",
        x: 4218,
        y: 1163
      },
      {
        type: "single",
        x: 4342,
        y: 1197
      },
      {
        type: "single",
        x: 4864,
        y: 360
      },
      {
        type: "single",
        x: 4941,
        y: 481
      },
      {
        type: "single",
        x: 5018,
        y: 598
      },
      {
        type: "single",
        x: 5095,
        y: 704
      },
      {
        type: "single",
        x: 5171,
        y: 798
      },
      {
        type: "single",
        x: 5247,
        y: 881
      },
      {
        type: "single",
        x: 5323,
        y: 952
      },
      {
        type: "single",
        x: 6357,
        y: 473
      },
      {
        type: "single",
        x: 6435,
        y: 575
      },
      {
        type: "single",
        x: 6512,
        y: 672
      },
      {
        type: "ground",
        x: 6553,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 6589,
        y: 764
      },
      {
        type: "single",
        x: 6666,
        y: 852
      },
      {
        type: "single",
        x: 6742,
        y: 936
      },
      {
        type: "single",
        x: 6818,
        y: 1016
      },
      {
        type: "single",
        x: 7773,
        y: 1648
      },
      {
        type: "single",
        x: 7845,
        y: 1665
      },
      {
        type: "single",
        x: 7916,
        y: 1677
      },
      {
        type: "single",
        x: 7987,
        y: 1677
      },
      {
        type: "single",
        x: 8058,
        y: 1666
      },
      {
        type: "single",
        x: 8129,
        y: 1644
      },
      {
        type: "single",
        x: 8199,
        y: 1611
      },
      {
        type: "single",
        x: 8501,
        y: 407
      },
      {
        type: "single",
        x: 8631,
        y: 543
      },
      {
        type: "single",
        x: 8759,
        y: 663
      },
      {
        type: "single",
        x: 8886,
        y: 767
      },
      {
        type: "single",
        x: 9013,
        y: 845
      },
      {
        type: "single",
        x: 9139,
        y: 887
      },
      {
        type: "single",
        x: 9264,
        y: 906
      },
      {
        type: "single",
        x: 10802,
        y: 431
      },
      {
        type: "single",
        x: 10939,
        y: 660
      },
      {
        type: "ground",
        x: 11020,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 11087,
        y: 865
      },
      {
        type: "single",
        x: 11222,
        y: 1005
      },
      {
        type: "single",
        x: 11356,
        y: 1100
      },
      {
        type: "single",
        x: 11489,
        y: 1149
      },
      {
        type: "single",
        x: 11622,
        y: 1168
      },
      {
        type: "single",
        x: 12127,
        y: 504
      },
      {
        type: "single",
        x: 12225,
        y: 614
      },
      {
        type: "single",
        x: 12322,
        y: 708
      },
      {
        type: "single",
        x: 12419,
        y: 787
      },
      {
        type: "single",
        x: 12515,
        y: 851
      },
      {
        type: "single",
        x: 12610,
        y: 899
      },
      {
        type: "single",
        x: 12705,
        y: 936
      },
      {
        type: "single",
        x: 13632,
        y: 733
      },
      {
        type: "single",
        x: 13721,
        y: 598
      },
      {
        type: "single",
        x: 13810,
        y: 437
      },
      {
        type: "single",
        x: 13899,
        y: 243
      },
      {
        type: "single",
        x: 14175,
        y: 1242
      },
      {
        type: "single",
        x: 14315,
        y: 1336
      },
      {
        type: "single",
        x: 14453,
        y: 1414
      },
      {
        type: "single",
        x: 14591,
        y: 1476
      },
      {
        type: "single",
        x: 14727,
        y: 1498
      },
      {
        type: "single",
        x: 14863,
        y: 1477
      },
      {
        type: "single",
        x: 14999,
        y: 1432
      },
      {
        type: "single",
        x: 15182,
        y: 628
      },
      {
        type: "single",
        x: 15298,
        y: 788
      },
      {
        type: "arc",
        x: 15360,
        y: 1308,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 15412,
        y: 932
      },
      {
        type: "single",
        x: 15526,
        y: 1060
      },
      {
        type: "single",
        x: 15639,
        y: 1172
      },
      {
        type: "single",
        x: 15751,
        y: 1269
      },
      {
        type: "single",
        x: 15862,
        y: 1349
      },
      {
        type: "single",
        x: 16785,
        y: 1319
      },
      {
        type: "single",
        x: 16891,
        y: 1192
      },
      {
        type: "single",
        x: 16996,
        y: 1025
      },
      {
        type: "single",
        x: 17099,
        y: 817
      },
      {
        type: "single",
        x: 17202,
        y: 591
      },
      {
        type: "single",
        x: 17496,
        y: 1312
      },
      {
        type: "single",
        x: 17624,
        y: 1372
      },
      {
        type: "single",
        x: 17751,
        y: 1387
      },
      {
        type: "single",
        x: 17878,
        y: 1363
      },
      {
        type: "single",
        x: 18004,
        y: 1326
      },
      {
        type: "single",
        x: 18130,
        y: 1250
      },
      {
        type: "single",
        x: 18254,
        y: 1128
      },
      {
        type: "single",
        x: 18333,
        y: 522
      },
      {
        type: "single",
        x: 18411,
        y: 629
      },
      {
        type: "single",
        x: 18488,
        y: 725
      },
      {
        type: "single",
        x: 18565,
        y: 808
      },
      {
        type: "single",
        x: 18642,
        y: 880
      },
      {
        type: "single",
        x: 18718,
        y: 941
      },
      {
        type: "single",
        x: 18794,
        y: 990
      },
      {
        type: "single",
        x: 19756,
        y: 843
      },
      {
        type: "single",
        x: 19828,
        y: 760
      },
      {
        type: "single",
        x: 19900,
        y: 665
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
        type: "single",
        x: 19971,
        y: 559
      },
      {
        type: "single",
        x: 20042,
        y: 444
      },
      {
        type: "single",
        x: 20112,
        y: 324
      },
      {
        type: "single",
        x: 20408,
        y: 1649
      },
      {
        type: "single",
        x: 20488,
        y: 1761
      },
      {
        type: "single",
        x: 20569,
        y: 1869
      },
      {
        type: "single",
        x: 20649,
        y: 1967
      },
      {
        type: "single",
        x: 20728,
        y: 2054
      },
      {
        type: "single",
        x: 20807,
        y: 2133
      },
      {
        type: "single",
        x: 20886,
        y: 2208
      },
      {
        type: "single",
        x: 21114,
        y: 530
      },
      {
        type: "single",
        x: 21195,
        y: 646
      },
      {
        type: "single",
        x: 21276,
        y: 758
      },
      {
        type: "single",
        x: 21356,
        y: 866
      },
      {
        type: "single",
        x: 21436,
        y: 969
      },
      {
        type: "single",
        x: 21515,
        y: 1068
      },
      {
        type: "single",
        x: 21593,
        y: 1162
      },
      {
        type: "single",
        x: 22509,
        y: 1843
      },
      {
        type: "single",
        x: 22584,
        y: 1844
      },
      {
        type: "single",
        x: 22658,
        y: 1835
      },
      {
        type: "single",
        x: 22732,
        y: 1814
      },
      {
        type: "single",
        x: 22805,
        y: 1782
      },
      {
        type: "single",
        x: 22878,
        y: 1739
      },
      {
        type: "single",
        x: 22951,
        y: 1685
      },
      {
        type: "single",
        x: 23269,
        y: 1948
      },
      {
        type: "single",
        x: 23408,
        y: 1655
      },
      {
        type: "single",
        x: 23545,
        y: 1321
      },
      {
        type: "single",
        x: 23680,
        y: 952
      },
      {
        type: "single",
        x: 23814,
        y: 573
      },
      {
        type: "single",
        x: 23945,
        y: 188
      },
      {
        type: "single",
        x: 24747,
        y: 493
      },
      {
        type: "single",
        x: 24833,
        y: 612
      },
      {
        type: "single",
        x: 24918,
        y: 727
      },
      {
        type: "single",
        x: 25003,
        y: 837
      },
      {
        type: "single",
        x: 25087,
        y: 942
      },
      {
        type: "single",
        x: 25171,
        y: 1044
      },
      {
        type: "single",
        x: 25254,
        y: 1141
      }
    ],
    blizzard: {
      speed: 780,
      accel: 7
    },
    expect: {
      upgrades: {
        flap: 3,
        slide: 3,
        magnet: 2,
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
        x: 150
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
        584,
        -262
      ],
      [
        1121,
        265
      ],
      [
        1788,
        -234
      ],
      [
        2436,
        243
      ],
      [
        3750,
        -497
      ],
      [
        5051,
        455
      ],
      [
        6419,
        -533
      ],
      [
        7695,
        443
      ],
      [
        8336,
        -235
      ],
      [
        8936,
        208
      ],
      [
        9534,
        -285
      ],
      [
        10113,
        230
      ],
      [
        10744,
        -293
      ],
      [
        11360,
        204
      ],
      [
        11811,
        7
      ],
      [
        12261,
        314
      ],
      [
        12681,
        116
      ],
      [
        13101,
        424
      ],
      [
        13537,
        220
      ],
      [
        13973,
        534
      ],
      [
        14931,
        -401
      ],
      [
        15863,
        324
      ],
      [
        16217,
        -115
      ],
      [
        16554,
        61
      ],
      [
        16867,
        -99
      ],
      [
        17170,
        93
      ],
      [
        17498,
        -77
      ],
      [
        17808,
        138
      ],
      [
        18451,
        -303
      ],
      [
        19141,
        352
      ],
      [
        19837,
        -298
      ],
      [
        20515,
        296
      ],
      [
        21195,
        -269
      ],
      [
        21862,
        341
      ],
      [
        23165,
        -486
      ],
      [
        24503,
        482
      ],
      [
        25791,
        -496
      ],
      [
        27098,
        419
      ],
      [
        27773,
        -293
      ],
      [
        28500,
        168
      ],
      [
        29096,
        -321
      ],
      [
        29729,
        133
      ],
      [
        30401,
        -334
      ],
      [
        31023,
        183
      ],
      [
        31903,
        -437
      ],
      [
        32846,
        331
      ],
      [
        33486,
        -200
      ],
      [
        34306,
        700
      ]
    ],
    fish: [
      {
        type: "ground",
        x: 120,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 1037,
        y: 312,
        soar: 1
      },
      {
        type: "single",
        x: 1103,
        y: 416,
        soar: 1
      },
      {
        type: "single",
        x: 1234,
        y: 597,
        soar: 1
      },
      {
        type: "single",
        x: 1320,
        y: 699,
        soar: 1
      },
      {
        type: "single",
        x: 1406,
        y: 785,
        soar: 1
      },
      {
        type: "single",
        x: 1599,
        y: 922,
        soar: 1
      },
      {
        type: "single",
        x: 1811,
        y: 985,
        soar: 1
      },
      {
        type: "single",
        x: 2021,
        y: 959,
        soar: 1
      },
      {
        type: "single",
        x: 2144,
        y: 940,
        soar: 1
      },
      {
        type: "single",
        x: 2229,
        y: 855,
        soar: 1
      },
      {
        type: "single",
        x: 2354,
        y: 801,
        soar: 1
      },
      {
        type: "single",
        x: 2394,
        y: 687,
        soar: 1
      },
      {
        type: "single",
        x: 2516,
        y: 500,
        soar: 1
      },
      {
        type: "single",
        x: 2520,
        y: 636,
        soar: 1
      },
      {
        type: "ground",
        x: 2556,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 2607,
        y: 833
      },
      {
        type: "single",
        x: 2698,
        y: 705
      },
      {
        type: "single",
        x: 2788,
        y: 567
      },
      {
        type: "single",
        x: 2878,
        y: 419
      },
      {
        type: "single",
        x: 5048,
        y: 583
      },
      {
        type: "single",
        x: 5163,
        y: 585
      },
      {
        type: "ground",
        x: 5171,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 5278,
        y: 568
      },
      {
        type: "single",
        x: 5391,
        y: 538
      },
      {
        type: "single",
        x: 5505,
        y: 474
      },
      {
        type: "single",
        x: 5617,
        y: 366
      },
      {
        type: "single",
        x: 5729,
        y: 230
      },
      {
        type: "single",
        x: 7533,
        y: 508
      },
      {
        type: "single",
        x: 7643,
        y: 624
      },
      {
        type: "single",
        x: 7753,
        y: 724
      },
      {
        type: "single",
        x: 7862,
        y: 809
      },
      {
        type: "single",
        x: 7970,
        y: 878
      },
      {
        type: "single",
        x: 8078,
        y: 932
      },
      {
        type: "single",
        x: 8185,
        y: 971
      },
      {
        type: "single",
        x: 8873,
        y: 320
      },
      {
        type: "single",
        x: 9012,
        y: 503
      },
      {
        type: "ground",
        x: 9056,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 9148,
        y: 669
      },
      {
        type: "single",
        x: 9284,
        y: 819
      },
      {
        type: "single",
        x: 9419,
        y: 953
      },
      {
        type: "single",
        x: 9552,
        y: 1071
      },
      {
        type: "single",
        x: 9685,
        y: 1173
      },
      {
        type: "single",
        x: 9984,
        y: 261
      },
      {
        type: "single",
        x: 10066,
        y: 408
      },
      {
        type: "single",
        x: 10147,
        y: 551
      },
      {
        type: "single",
        x: 10228,
        y: 689
      },
      {
        type: "single",
        x: 10308,
        y: 822
      },
      {
        type: "single",
        x: 10388,
        y: 951
      },
      {
        type: "single",
        x: 10468,
        y: 1076
      },
      {
        type: "single",
        x: 10592,
        y: 1457
      },
      {
        type: "single",
        x: 10718,
        y: 1436
      },
      {
        type: "single",
        x: 10844,
        y: 1375
      },
      {
        type: "single",
        x: 10969,
        y: 1269
      },
      {
        type: "single",
        x: 11094,
        y: 1120
      },
      {
        type: "single",
        x: 11217,
        y: 951
      },
      {
        type: "single",
        x: 11339,
        y: 749
      },
      {
        type: "single",
        x: 11916,
        y: 2372
      },
      {
        type: "single",
        x: 11990,
        y: 2388
      },
      {
        type: "single",
        x: 12063,
        y: 2395
      },
      {
        type: "single",
        x: 12137,
        y: 2399
      },
      {
        type: "single",
        x: 12210,
        y: 2400
      },
      {
        type: "single",
        x: 12283,
        y: 2397
      },
      {
        type: "single",
        x: 12315,
        y: 518
      },
      {
        type: "single",
        x: 12355,
        y: 2392
      },
      {
        type: "single",
        x: 12389,
        y: 595
      },
      {
        type: "single",
        x: 12463,
        y: 667
      },
      {
        type: "single",
        x: 12537,
        y: 735
      },
      {
        type: "single",
        x: 12610,
        y: 803
      },
      {
        type: "single",
        x: 12695,
        y: 885
      },
      {
        type: "single",
        x: 12768,
        y: 958
      },
      {
        type: "single",
        x: 13690,
        y: 1283
      },
      {
        type: "single",
        x: 13828,
        y: 1176
      },
      {
        type: "single",
        x: 13965,
        y: 1050
      },
      {
        type: "single",
        x: 14101,
        y: 884
      },
      {
        type: "single",
        x: 14236,
        y: 676
      },
      {
        type: "single",
        x: 14369,
        y: 425
      },
      {
        type: "single",
        x: 14501,
        y: 132
      },
      {
        type: "single",
        x: 15728,
        y: 448
      },
      {
        type: "single",
        x: 15811,
        y: 568
      },
      {
        type: "single",
        x: 15895,
        y: 685
      },
      {
        type: "single",
        x: 15978,
        y: 796
      },
      {
        type: "single",
        x: 16060,
        y: 904
      },
      {
        type: "single",
        x: 16142,
        y: 1007
      },
      {
        type: "single",
        x: 16224,
        y: 1102
      },
      {
        type: "single",
        x: 16560,
        y: 1485
      },
      {
        type: "single",
        x: 16649,
        y: 1575
      },
      {
        type: "single",
        x: 16738,
        y: 1660
      },
      {
        type: "single",
        x: 16826,
        y: 1741
      },
      {
        type: "single",
        x: 16914,
        y: 1818
      },
      {
        type: "single",
        x: 17002,
        y: 1891
      },
      {
        type: "single",
        x: 17089,
        y: 1960
      },
      {
        type: "single",
        x: 17176,
        y: 1488
      },
      {
        type: "single",
        x: 17254,
        y: 1468
      },
      {
        type: "single",
        x: 17331,
        y: 1438
      },
      {
        type: "single",
        x: 17409,
        y: 1399
      },
      {
        type: "single",
        x: 17485,
        y: 1357
      },
      {
        type: "single",
        x: 17562,
        y: 1313
      },
      {
        type: "single",
        x: 17638,
        y: 1265
      },
      {
        type: "ground",
        x: 17928,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 18607,
        y: 2249
      },
      {
        type: "single",
        x: 18689,
        y: 2220
      },
      {
        type: "single",
        x: 18771,
        y: 2189
      },
      {
        type: "single",
        x: 18852,
        y: 2154
      },
      {
        type: "single",
        x: 18933,
        y: 2118
      },
      {
        type: "single",
        x: 19014,
        y: 2078
      },
      {
        type: "single",
        x: 19095,
        y: 2036
      },
      {
        type: "arc",
        x: 19221,
        y: 1202,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 20461,
        y: 449
      },
      {
        type: "single",
        x: 20579,
        y: 620
      },
      {
        type: "arc",
        x: 20595,
        y: 1146,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 20696,
        y: 775
      },
      {
        type: "single",
        x: 20813,
        y: 914
      },
      {
        type: "single",
        x: 20928,
        y: 1037
      },
      {
        type: "single",
        x: 21043,
        y: 1144
      },
      {
        type: "single",
        x: 21157,
        y: 1230
      },
      {
        type: "single",
        x: 21714,
        y: 372
      },
      {
        type: "single",
        x: 21804,
        y: 539
      },
      {
        type: "single",
        x: 21893,
        y: 701
      },
      {
        type: "single",
        x: 21982,
        y: 858
      },
      {
        type: "single",
        x: 22071,
        y: 1010
      },
      {
        type: "single",
        x: 22159,
        y: 1156
      },
      {
        type: "single",
        x: 22246,
        y: 1290
      },
      {
        type: "single",
        x: 23757,
        y: 2050
      },
      {
        type: "single",
        x: 23838,
        y: 2002
      },
      {
        type: "single",
        x: 23919,
        y: 1942
      },
      {
        type: "single",
        x: 24e3,
        y: 1871
      },
      {
        type: "single",
        x: 24080,
        y: 1790
      },
      {
        type: "single",
        x: 24160,
        y: 1700
      },
      {
        type: "single",
        x: 24240,
        y: 1608
      },
      {
        type: "single",
        x: 24303,
        y: 600
      },
      {
        type: "single",
        x: 24380,
        y: 695
      },
      {
        type: "single",
        x: 24457,
        y: 785
      },
      {
        type: "single",
        x: 24533,
        y: 872
      },
      {
        type: "arc",
        x: 24583,
        y: 1332,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 24609,
        y: 954
      },
      {
        type: "single",
        x: 24685,
        y: 1032
      },
      {
        type: "single",
        x: 24760,
        y: 1106
      },
      {
        type: "single",
        x: 25711,
        y: 1707
      },
      {
        type: "single",
        x: 25782,
        y: 1726
      },
      {
        type: "single",
        x: 25854,
        y: 1741
      },
      {
        type: "single",
        x: 25925,
        y: 1753
      },
      {
        type: "single",
        x: 25995,
        y: 1760
      },
      {
        type: "single",
        x: 26066,
        y: 1764
      },
      {
        type: "single",
        x: 26136,
        y: 1765
      },
      {
        type: "single",
        x: 26801,
        y: 448
      },
      {
        type: "single",
        x: 26900,
        y: 588
      },
      {
        type: "single",
        x: 26998,
        y: 724
      },
      {
        type: "single",
        x: 27096,
        y: 855
      },
      {
        type: "single",
        x: 27193,
        y: 982
      },
      {
        type: "single",
        x: 27290,
        y: 1104
      },
      {
        type: "single",
        x: 27386,
        y: 1222
      },
      {
        type: "single",
        x: 28442,
        y: 322
      },
      {
        type: "single",
        x: 28540,
        y: 444
      },
      {
        type: "single",
        x: 28638,
        y: 560
      },
      {
        type: "single",
        x: 28735,
        y: 672
      },
      {
        type: "single",
        x: 28832,
        y: 780
      },
      {
        type: "single",
        x: 28928,
        y: 884
      },
      {
        type: "single",
        x: 29024,
        y: 983
      },
      {
        type: "single",
        x: 29307,
        y: 2719
      },
      {
        type: "single",
        x: 29395,
        y: 2730
      },
      {
        type: "single",
        x: 29482,
        y: 2730
      },
      {
        type: "single",
        x: 29569,
        y: 2718
      },
      {
        type: "single",
        x: 29656,
        y: 2695
      },
      {
        type: "single",
        x: 29742,
        y: 2661
      },
      {
        type: "single",
        x: 29829,
        y: 2615
      },
      {
        type: "ground",
        x: 29849,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 29952,
        y: 1743
      },
      {
        type: "single",
        x: 30042,
        y: 1796
      },
      {
        type: "single",
        x: 30132,
        y: 1846
      },
      {
        type: "single",
        x: 30222,
        y: 1891
      },
      {
        type: "single",
        x: 30311,
        y: 1933
      },
      {
        type: "single",
        x: 30400,
        y: 1971
      },
      {
        type: "single",
        x: 30489,
        y: 2005
      },
      {
        type: "single",
        x: 31442,
        y: 2128
      },
      {
        type: "single",
        x: 31526,
        y: 2118
      },
      {
        type: "single",
        x: 31611,
        y: 2105
      },
      {
        type: "single",
        x: 31695,
        y: 2089
      },
      {
        type: "single",
        x: 31779,
        y: 2065
      },
      {
        type: "single",
        x: 31862,
        y: 2029
      },
      {
        type: "single",
        x: 31946,
        y: 1983
      },
      {
        type: "single",
        x: 32661,
        y: 385
      },
      {
        type: "single",
        x: 32763,
        y: 543
      },
      {
        type: "single",
        x: 32864,
        y: 697
      },
      {
        type: "single",
        x: 32965,
        y: 845
      },
      {
        type: "single",
        x: 33065,
        y: 989
      },
      {
        type: "single",
        x: 33164,
        y: 1129
      },
      {
        type: "single",
        x: 33263,
        y: 1264
      }
    ],
    blizzard: {
      speed: 1080,
      accel: 7
    },
    expect: {
      upgrades: {
        flap: 4,
        slide: 4,
        magnet: 2,
        glide: 2,
        scarf: 1
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
        7755,
        8376
      ],
      [
        10173,
        10784
      ],
      [
        14033,
        14971
      ],
      [
        27158,
        27813
      ]
    ],
    wind: [
      {
        x: 8176,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 12521,
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
        x: 150
      },
      {
        type: "spire",
        x: 700,
        s: 0.94,
        v: 1
      },
      {
        type: "spire",
        x: 1142,
        s: 0.98,
        v: 2
      },
      {
        type: "spire",
        x: 1547,
        s: 0.78,
        v: 2
      },
      {
        type: "pine",
        x: 2104,
        s: 1.07,
        v: 0
      },
      {
        type: "rock",
        x: 2666,
        s: 0.8,
        v: 1
      },
      {
        type: "spire",
        x: 3256,
        s: 0.88,
        v: 0
      },
      {
        type: "pine",
        x: 3749,
        s: 1.05,
        v: 1
      },
      {
        type: "rock",
        x: 4448,
        s: 0.82,
        v: 0
      },
      {
        type: "rock",
        x: 5092,
        s: 1,
        v: 0
      },
      {
        type: "pine",
        x: 5476,
        s: 0.77,
        v: 1
      },
      {
        type: "pine",
        x: 6086,
        s: 0.87,
        v: 2
      },
      {
        type: "pine",
        x: 6601,
        s: 0.79,
        v: 1
      },
      {
        type: "pine",
        x: 7018,
        s: 0.77,
        v: 1
      },
      {
        type: "pine",
        x: 7420,
        s: 0.95,
        v: 0
      },
      {
        type: "spire",
        x: 7888,
        s: 0.94,
        v: 0
      },
      {
        type: "pine",
        x: 8590,
        s: 1.04,
        v: 0
      },
      {
        type: "spire",
        x: 9340,
        s: 0.89,
        v: 2
      },
      {
        type: "spire",
        x: 9997,
        s: 0.79,
        v: 0
      },
      {
        type: "pine",
        x: 10621,
        s: 0.97,
        v: 0
      },
      {
        type: "pine",
        x: 11270,
        s: 0.8,
        v: 1
      },
      {
        type: "pine",
        x: 11848,
        s: 0.92,
        v: 1
      },
      {
        type: "spire",
        x: 12597,
        s: 0.97,
        v: 2
      },
      {
        type: "pine",
        x: 13276,
        s: 0.79,
        v: 2
      },
      {
        type: "pine",
        x: 13876,
        s: 0.88,
        v: 2
      },
      {
        type: "pine",
        x: 14265,
        s: 0.8,
        v: 2
      },
      {
        type: "pine",
        x: 14816,
        s: 0.96,
        v: 1
      },
      {
        type: "spire",
        x: 15285,
        s: 0.88,
        v: 2
      },
      {
        type: "rock",
        x: 15834,
        s: 1,
        v: 1
      },
      {
        type: "pine",
        x: 16336,
        s: 1.02,
        v: 0
      },
      {
        type: "pine",
        x: 16803,
        s: 0.86,
        v: 0
      },
      {
        type: "spire",
        x: 17512,
        s: 0.76,
        v: 0
      },
      {
        type: "rock",
        x: 18090,
        s: 0.88,
        v: 0
      },
      {
        type: "pine",
        x: 18731,
        s: 0.97,
        v: 0
      },
      {
        type: "pine",
        x: 19471,
        s: 0.98,
        v: 2
      },
      {
        type: "rock",
        x: 20030,
        s: 0.78,
        v: 2
      },
      {
        type: "spire",
        x: 20483,
        s: 1.08,
        v: 0
      },
      {
        type: "spire",
        x: 20942,
        s: 1.05,
        v: 0
      },
      {
        type: "rock",
        x: 21695,
        s: 0.83,
        v: 2
      },
      {
        type: "pine",
        x: 22257,
        s: 0.8,
        v: 2
      },
      {
        type: "pine",
        x: 22691,
        s: 0.96,
        v: 1
      },
      {
        type: "rock",
        x: 23421,
        s: 0.93,
        v: 2
      },
      {
        type: "pine",
        x: 23863,
        s: 0.76,
        v: 2
      },
      {
        type: "pine",
        x: 24351,
        s: 0.99,
        v: 2
      },
      {
        type: "rock",
        x: 25015,
        s: 0.91,
        v: 0
      },
      {
        type: "pine",
        x: 25557,
        s: 0.94,
        v: 0
      },
      {
        type: "rock",
        x: 25984,
        s: 0.81,
        v: 2
      },
      {
        type: "spire",
        x: 26715,
        s: 0.99,
        v: 1
      },
      {
        type: "spire",
        x: 27372,
        s: 0.82,
        v: 0
      },
      {
        type: "rock",
        x: 28006,
        s: 0.8,
        v: 0
      },
      {
        type: "rock",
        x: 28470,
        s: 0.95,
        v: 2
      },
      {
        type: "pine",
        x: 29048,
        s: 0.95,
        v: 2
      },
      {
        type: "pine",
        x: 29772,
        s: 1.01,
        v: 0
      },
      {
        type: "rock",
        x: 30499,
        s: 0.77,
        v: 0
      },
      {
        type: "spire",
        x: 31161,
        s: 1.01,
        v: 0
      },
      {
        type: "rock",
        x: 31575,
        s: 1.01,
        v: 2
      },
      {
        type: "rock",
        x: 32110,
        s: 0.8,
        v: 1
      },
      {
        type: "rock",
        x: 32835,
        s: 1.02,
        v: 0
      },
      {
        type: "rock",
        x: 33336,
        s: 0.91,
        v: 2
      },
      {
        type: "snowman",
        x: 15438,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 34266
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
        x: 1198,
        y: 328,
        soar: 1
      },
      {
        type: "single",
        x: 1274,
        y: 431,
        soar: 1
      },
      {
        type: "single",
        x: 1349,
        y: 525,
        soar: 1
      },
      {
        type: "single",
        x: 1498,
        y: 687,
        soar: 1
      },
      {
        type: "single",
        x: 1597,
        y: 775,
        soar: 1
      },
      {
        type: "single",
        x: 1695,
        y: 848,
        soar: 1
      },
      {
        type: "single",
        x: 1890,
        y: 948,
        soar: 1
      },
      {
        type: "single",
        x: 2011,
        y: 980,
        soar: 1
      },
      {
        type: "single",
        x: 2132,
        y: 988,
        soar: 1
      },
      {
        type: "single",
        x: 2252,
        y: 973,
        soar: 1
      },
      {
        type: "single",
        x: 2443,
        y: 822,
        soar: 1
      },
      {
        type: "single",
        x: 2514,
        y: 720,
        soar: 1
      },
      {
        type: "single",
        x: 2584,
        y: 600,
        soar: 1
      },
      {
        type: "single",
        x: 2654,
        y: 475,
        soar: 1
      },
      {
        type: "single",
        x: 2752,
        y: 287
      },
      {
        type: "single",
        x: 3753,
        y: 360
      },
      {
        type: "single",
        x: 3845,
        y: 509
      },
      {
        type: "single",
        x: 3936,
        y: 654
      },
      {
        type: "single",
        x: 4027,
        y: 794
      },
      {
        type: "single",
        x: 4117,
        y: 929
      },
      {
        type: "single",
        x: 4206,
        y: 1060
      },
      {
        type: "single",
        x: 4295,
        y: 1186
      },
      {
        type: "single",
        x: 4593,
        y: 1517
      },
      {
        type: "single",
        x: 4689,
        y: 1617
      },
      {
        type: "single",
        x: 4784,
        y: 1714
      },
      {
        type: "single",
        x: 4878,
        y: 1806
      },
      {
        type: "single",
        x: 4972,
        y: 1893
      },
      {
        type: "single",
        x: 5066,
        y: 1977
      },
      {
        type: "single",
        x: 5159,
        y: 2057
      },
      {
        type: "single",
        x: 5248,
        y: 1844
      },
      {
        type: "single",
        x: 5332,
        y: 1836
      },
      {
        type: "single",
        x: 5417,
        y: 1816
      },
      {
        type: "single",
        x: 5501,
        y: 1785
      },
      {
        type: "single",
        x: 5585,
        y: 1743
      },
      {
        type: "single",
        x: 5668,
        y: 1690
      },
      {
        type: "single",
        x: 5751,
        y: 1626
      },
      {
        type: "single",
        x: 6679,
        y: 2693
      },
      {
        type: "single",
        x: 6767,
        y: 2689
      },
      {
        type: "single",
        x: 6855,
        y: 2682
      },
      {
        type: "single",
        x: 6942,
        y: 2673
      },
      {
        type: "single",
        x: 7029,
        y: 2661
      },
      {
        type: "single",
        x: 7116,
        y: 2647
      },
      {
        type: "single",
        x: 7202,
        y: 2626
      },
      {
        type: "single",
        x: 7884,
        y: 438
      },
      {
        type: "single",
        x: 7974,
        y: 567
      },
      {
        type: "single",
        x: 8064,
        y: 688
      },
      {
        type: "single",
        x: 8154,
        y: 805
      },
      {
        type: "single",
        x: 8243,
        y: 913
      },
      {
        type: "single",
        x: 8332,
        y: 1010
      },
      {
        type: "single",
        x: 8420,
        y: 1098
      },
      {
        type: "single",
        x: 9451,
        y: 1832
      },
      {
        type: "single",
        x: 9535,
        y: 1868
      },
      {
        type: "single",
        x: 9618,
        y: 1899
      },
      {
        type: "single",
        x: 9701,
        y: 1927
      },
      {
        type: "single",
        x: 9784,
        y: 1951
      },
      {
        type: "single",
        x: 9867,
        y: 1970
      },
      {
        type: "single",
        x: 9949,
        y: 1979
      },
      {
        type: "ground",
        x: 10138,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 10321,
        y: 537
      },
      {
        type: "single",
        x: 10433,
        y: 557
      },
      {
        type: "single",
        x: 10546,
        y: 572
      },
      {
        type: "single",
        x: 10658,
        y: 583
      },
      {
        type: "single",
        x: 10769,
        y: 590
      },
      {
        type: "single",
        x: 10880,
        y: 593
      },
      {
        type: "single",
        x: 10916,
        y: 1363
      },
      {
        type: "single",
        x: 10991,
        y: 593
      },
      {
        type: "single",
        x: 10994,
        y: 1246
      },
      {
        type: "single",
        x: 11072,
        y: 1119
      },
      {
        type: "single",
        x: 11149,
        y: 982
      },
      {
        type: "single",
        x: 11226,
        y: 834
      },
      {
        type: "single",
        x: 11303,
        y: 682
      },
      {
        type: "single",
        x: 11379,
        y: 527
      },
      {
        type: "ground",
        x: 11453,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 12562,
        y: 336
      },
      {
        type: "single",
        x: 12658,
        y: 486
      },
      {
        type: "single",
        x: 12753,
        y: 631
      },
      {
        type: "single",
        x: 12848,
        y: 771
      },
      {
        type: "single",
        x: 12941,
        y: 906
      },
      {
        type: "single",
        x: 13035,
        y: 1037
      },
      {
        type: "single",
        x: 13127,
        y: 1163
      },
      {
        type: "single",
        x: 13718,
        y: 177
      },
      {
        type: "single",
        x: 13820,
        y: 338
      },
      {
        type: "single",
        x: 13921,
        y: 494
      },
      {
        type: "single",
        x: 14021,
        y: 646
      },
      {
        type: "single",
        x: 14116,
        y: 2075
      },
      {
        type: "single",
        x: 14121,
        y: 793
      },
      {
        type: "single",
        x: 14203,
        y: 2094
      },
      {
        type: "single",
        x: 14220,
        y: 935
      },
      {
        type: "single",
        x: 14290,
        y: 2102
      },
      {
        type: "single",
        x: 14318,
        y: 1073
      },
      {
        type: "single",
        x: 14377,
        y: 2098
      },
      {
        type: "single",
        x: 14464,
        y: 2083
      },
      {
        type: "single",
        x: 14550,
        y: 2057
      },
      {
        type: "single",
        x: 14637,
        y: 2019
      },
      {
        type: "single",
        x: 15639,
        y: 857
      },
      {
        type: "single",
        x: 15720,
        y: 732
      },
      {
        type: "single",
        x: 15800,
        y: 604
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
        type: "single",
        x: 15880,
        y: 474
      },
      {
        type: "single",
        x: 15959,
        y: 342
      },
      {
        type: "single",
        x: 16038,
        y: 208
      },
      {
        type: "single",
        x: 16374,
        y: 2270
      },
      {
        type: "single",
        x: 16464,
        y: 2221
      },
      {
        type: "single",
        x: 16553,
        y: 2169
      },
      {
        type: "single",
        x: 16642,
        y: 2114
      },
      {
        type: "single",
        x: 16731,
        y: 2049
      },
      {
        type: "single",
        x: 16819,
        y: 1973
      },
      {
        type: "single",
        x: 16907,
        y: 1886
      },
      {
        type: "single",
        x: 17371,
        y: 356
      },
      {
        type: "single",
        x: 17473,
        y: 524
      },
      {
        type: "single",
        x: 17575,
        y: 682
      },
      {
        type: "ground",
        x: 17651,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 17675,
        y: 833
      },
      {
        type: "single",
        x: 17775,
        y: 979
      },
      {
        type: "single",
        x: 17874,
        y: 1115
      },
      {
        type: "single",
        x: 17973,
        y: 1239
      },
      {
        type: "single",
        x: 18946,
        y: 2224
      },
      {
        type: "single",
        x: 19039,
        y: 2297
      },
      {
        type: "single",
        x: 19131,
        y: 2366
      },
      {
        type: "single",
        x: 19224,
        y: 2432
      },
      {
        type: "single",
        x: 19315,
        y: 2493
      },
      {
        type: "single",
        x: 19407,
        y: 2550
      },
      {
        type: "single",
        x: 19498,
        y: 2604
      },
      {
        type: "single",
        x: 19764,
        y: 288
      },
      {
        type: "single",
        x: 19870,
        y: 369
      },
      {
        type: "single",
        x: 19975,
        y: 404
      },
      {
        type: "single",
        x: 20081,
        y: 394
      },
      {
        type: "single",
        x: 20185,
        y: 339
      },
      {
        type: "single",
        x: 20478,
        y: 2706
      },
      {
        type: "single",
        x: 20565,
        y: 2651
      },
      {
        type: "single",
        x: 20651,
        y: 2585
      },
      {
        type: "single",
        x: 20738,
        y: 2509
      },
      {
        type: "single",
        x: 20824,
        y: 2422
      },
      {
        type: "single",
        x: 20909,
        y: 2323
      },
      {
        type: "single",
        x: 20995,
        y: 2214
      },
      {
        type: "single",
        x: 21736,
        y: 611
      },
      {
        type: "ground",
        x: 21763,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 21871,
        y: 774
      },
      {
        type: "single",
        x: 22004,
        y: 892
      },
      {
        type: "single",
        x: 22137,
        y: 963
      },
      {
        type: "single",
        x: 22270,
        y: 995
      },
      {
        type: "single",
        x: 22401,
        y: 1009
      },
      {
        type: "single",
        x: 22532,
        y: 1005
      },
      {
        type: "single",
        x: 22881,
        y: 356
      },
      {
        type: "single",
        x: 22985,
        y: 542
      },
      {
        type: "arc",
        x: 23011,
        y: 1110,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 23089,
        y: 722
      },
      {
        type: "single",
        x: 23191,
        y: 898
      },
      {
        type: "single",
        x: 23293,
        y: 1068
      },
      {
        type: "single",
        x: 23394,
        y: 1234
      },
      {
        type: "single",
        x: 23495,
        y: 1394
      },
      {
        type: "single",
        x: 24097,
        y: 187
      },
      {
        type: "single",
        x: 24198,
        y: 333
      },
      {
        type: "single",
        x: 24298,
        y: 474
      },
      {
        type: "single",
        x: 24397,
        y: 607
      },
      {
        type: "single",
        x: 24462,
        y: 2613
      },
      {
        type: "single",
        x: 24496,
        y: 728
      },
      {
        type: "single",
        x: 24556,
        y: 2676
      },
      {
        type: "single",
        x: 24594,
        y: 837
      },
      {
        type: "single",
        x: 24650,
        y: 2728
      },
      {
        type: "single",
        x: 24692,
        y: 934
      },
      {
        type: "single",
        x: 24743,
        y: 2768
      },
      {
        type: "single",
        x: 24836,
        y: 2802
      },
      {
        type: "single",
        x: 24928,
        y: 2832
      },
      {
        type: "single",
        x: 25020,
        y: 2855
      },
      {
        type: "single",
        x: 26012,
        y: 2513
      },
      {
        type: "single",
        x: 26100,
        y: 2420
      },
      {
        type: "single",
        x: 26187,
        y: 2315
      },
      {
        type: "single",
        x: 26274,
        y: 2200
      },
      {
        type: "single",
        x: 26361,
        y: 2075
      },
      {
        type: "single",
        x: 26447,
        y: 1939
      },
      {
        type: "single",
        x: 26532,
        y: 1794
      },
      {
        type: "single",
        x: 28961,
        y: 472
      },
      {
        type: "single",
        x: 29043,
        y: 589
      },
      {
        type: "single",
        x: 29124,
        y: 702
      },
      {
        type: "single",
        x: 29206,
        y: 810
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
        type: "single",
        x: 29286,
        y: 914
      },
      {
        type: "single",
        x: 29367,
        y: 1013
      },
      {
        type: "single",
        x: 29447,
        y: 1108
      }
    ],
    blizzard: {
      speed: 1300,
      accel: 8
    },
    expect: {
      upgrades: {
        flap: 5,
        slide: 5,
        magnet: 3,
        glide: 3,
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
        x: 150
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
        602,
        -231
      ],
      [
        1169,
        294
      ],
      [
        1770,
        -152
      ],
      [
        2358,
        292
      ],
      [
        3048,
        -223
      ],
      [
        3699,
        372
      ],
      [
        4393,
        -212
      ],
      [
        5035,
        439
      ],
      [
        5735,
        -161
      ],
      [
        6449,
        401
      ],
      [
        7134,
        -177
      ],
      [
        7780,
        391
      ],
      [
        8454,
        -157
      ],
      [
        9107,
        339
      ],
      [
        9773,
        -153
      ],
      [
        10421,
        375
      ],
      [
        11016,
        -131
      ],
      [
        11651,
        371
      ],
      [
        12576,
        -262
      ],
      [
        13533,
        502
      ],
      [
        14437,
        -272
      ],
      [
        15295,
        499
      ],
      [
        15625,
        20
      ],
      [
        15968,
        201
      ],
      [
        16323,
        24
      ],
      [
        16702,
        216
      ],
      [
        17013,
        21
      ],
      [
        17328,
        219
      ],
      [
        17979,
        -200
      ],
      [
        18617,
        440
      ],
      [
        19273,
        -183
      ],
      [
        19875,
        423
      ],
      [
        20521,
        -189
      ],
      [
        21122,
        417
      ],
      [
        21792,
        -203
      ],
      [
        22471,
        443
      ],
      [
        23759,
        -362
      ],
      [
        25032,
        557
      ],
      [
        26317,
        -374
      ],
      [
        27535,
        538
      ],
      [
        28191,
        -186
      ],
      [
        28894,
        350
      ],
      [
        29553,
        -136
      ],
      [
        30212,
        376
      ],
      [
        30792,
        -143
      ],
      [
        31339,
        315
      ],
      [
        32210,
        -258
      ],
      [
        33148,
        498
      ],
      [
        33788,
        -200
      ],
      [
        34608,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 1063,
        y: 326,
        soar: 1
      },
      {
        type: "single",
        x: 1136,
        y: 447,
        soar: 1
      },
      {
        type: "single",
        x: 1209,
        y: 558,
        soar: 1
      },
      {
        type: "single",
        x: 1282,
        y: 660,
        soar: 1
      },
      {
        type: "single",
        x: 1426,
        y: 838,
        soar: 1
      },
      {
        type: "single",
        x: 1521,
        y: 938,
        soar: 1
      },
      {
        type: "single",
        x: 1616,
        y: 1022,
        soar: 1
      },
      {
        type: "single",
        x: 1805,
        y: 1143,
        soar: 1
      },
      {
        type: "single",
        x: 1922,
        y: 1182,
        soar: 1
      },
      {
        type: "single",
        x: 2155,
        y: 1116,
        soar: 1
      },
      {
        type: "single",
        x: 2248,
        y: 1039,
        soar: 1
      },
      {
        type: "single",
        x: 2340,
        y: 941,
        soar: 1
      },
      {
        type: "single",
        x: 2409,
        y: 838,
        soar: 1
      },
      {
        type: "single",
        x: 2477,
        y: 711,
        soar: 1
      },
      {
        type: "single",
        x: 2580,
        y: 564,
        soar: 1
      },
      {
        type: "single",
        x: 2712,
        y: 1398
      },
      {
        type: "single",
        x: 2811,
        y: 1355
      },
      {
        type: "single",
        x: 2909,
        y: 1301
      },
      {
        type: "single",
        x: 3007,
        y: 1238
      },
      {
        type: "single",
        x: 3641,
        y: 551
      },
      {
        type: "single",
        x: 3718,
        y: 672
      },
      {
        type: "arc",
        x: 3779,
        y: 1372,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 3794,
        y: 786
      },
      {
        type: "ground",
        x: 3819,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 3870,
        y: 896
      },
      {
        type: "single",
        x: 3954,
        y: 1019
      },
      {
        type: "single",
        x: 4045,
        y: 1153
      },
      {
        type: "single",
        x: 4136,
        y: 1281
      },
      {
        type: "single",
        x: 5111,
        y: 1915
      },
      {
        type: "ground",
        x: 5155,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 5198,
        y: 1904
      },
      {
        type: "single",
        x: 5284,
        y: 1882
      },
      {
        type: "single",
        x: 5370,
        y: 1849
      },
      {
        type: "single",
        x: 5456,
        y: 1805
      },
      {
        type: "single",
        x: 5542,
        y: 1750
      },
      {
        type: "single",
        x: 5627,
        y: 1684
      },
      {
        type: "single",
        x: 6323,
        y: 498
      },
      {
        type: "single",
        x: 6411,
        y: 643
      },
      {
        type: "single",
        x: 6498,
        y: 784
      },
      {
        type: "ground",
        x: 6569,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 6585,
        y: 920
      },
      {
        type: "single",
        x: 6684,
        y: 1078
      },
      {
        type: "single",
        x: 6789,
        y: 1244
      },
      {
        type: "single",
        x: 6893,
        y: 1405
      },
      {
        type: "single",
        x: 7709,
        y: 552
      },
      {
        type: "single",
        x: 7801,
        y: 715
      },
      {
        type: "single",
        x: 7893,
        y: 873
      },
      {
        type: "single",
        x: 7985,
        y: 1019
      },
      {
        type: "single",
        x: 8076,
        y: 1152
      },
      {
        type: "single",
        x: 8166,
        y: 1274
      },
      {
        type: "single",
        x: 8256,
        y: 1384
      },
      {
        type: "single",
        x: 8585,
        y: 2872
      },
      {
        type: "single",
        x: 8681,
        y: 2861
      },
      {
        type: "single",
        x: 8777,
        y: 2847
      },
      {
        type: "single",
        x: 8872,
        y: 2829
      },
      {
        type: "single",
        x: 8968,
        y: 2802
      },
      {
        type: "single",
        x: 9062,
        y: 2763
      },
      {
        type: "single",
        x: 9157,
        y: 2713
      },
      {
        type: "single",
        x: 9220,
        y: 1834
      },
      {
        type: "ground",
        x: 9227,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 9306,
        y: 1814
      },
      {
        type: "single",
        x: 9392,
        y: 1791
      },
      {
        type: "single",
        x: 9477,
        y: 1760
      },
      {
        type: "single",
        x: 9562,
        y: 1718
      },
      {
        type: "single",
        x: 9647,
        y: 1669
      },
      {
        type: "single",
        x: 9732,
        y: 1618
      },
      {
        type: "single",
        x: 10707,
        y: 1105
      },
      {
        type: "single",
        x: 10794,
        y: 988
      },
      {
        type: "single",
        x: 10882,
        y: 869
      },
      {
        type: "single",
        x: 10968,
        y: 748
      },
      {
        type: "single",
        x: 11055,
        y: 625
      },
      {
        type: "single",
        x: 11140,
        y: 501
      },
      {
        type: "single",
        x: 11226,
        y: 374
      },
      {
        type: "single",
        x: 11591,
        y: 543
      },
      {
        type: "single",
        x: 11690,
        y: 704
      },
      {
        type: "single",
        x: 11788,
        y: 860
      },
      {
        type: "single",
        x: 11897,
        y: 1032
      },
      {
        type: "single",
        x: 12015,
        y: 1221
      },
      {
        type: "single",
        x: 12132,
        y: 1405
      },
      {
        type: "single",
        x: 12249,
        y: 1583
      },
      {
        type: "single",
        x: 13260,
        y: 2883
      },
      {
        type: "single",
        x: 13369,
        y: 2974
      },
      {
        type: "single",
        x: 13478,
        y: 3054
      },
      {
        type: "single",
        x: 13586,
        y: 3122
      },
      {
        type: "single",
        x: 13713,
        y: 3198
      },
      {
        type: "single",
        x: 13843,
        y: 3271
      },
      {
        type: "single",
        x: 13973,
        y: 3340
      },
      {
        type: "single",
        x: 14987,
        y: 3747
      },
      {
        type: "single",
        x: 15111,
        y: 3780
      },
      {
        type: "single",
        x: 15235,
        y: 3809
      },
      {
        type: "single",
        x: 15357,
        y: 3834
      },
      {
        type: "arc",
        x: 15375,
        y: 1499,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 15480,
        y: 3856
      },
      {
        type: "single",
        x: 15602,
        y: 3873
      },
      {
        type: "single",
        x: 15723,
        y: 3883
      },
      {
        type: "single",
        x: 16035,
        y: 2087
      },
      {
        type: "single",
        x: 16120,
        y: 2207
      },
      {
        type: "single",
        x: 16205,
        y: 2322
      },
      {
        type: "single",
        x: 16290,
        y: 2430
      },
      {
        type: "single",
        x: 16374,
        y: 2525
      },
      {
        type: "single",
        x: 16458,
        y: 2612
      },
      {
        type: "single",
        x: 16542,
        y: 2695
      },
      {
        type: "single",
        x: 16674,
        y: 3667
      },
      {
        type: "single",
        x: 16791,
        y: 3595
      },
      {
        type: "single",
        x: 16907,
        y: 3513
      },
      {
        type: "single",
        x: 17022,
        y: 3420
      },
      {
        type: "single",
        x: 17137,
        y: 3316
      },
      {
        type: "single",
        x: 17251,
        y: 3201
      },
      {
        type: "single",
        x: 17364,
        y: 3076
      },
      {
        type: "single",
        x: 18083,
        y: 3056
      },
      {
        type: "single",
        x: 18162,
        y: 3039
      },
      {
        type: "single",
        x: 18241,
        y: 3020
      },
      {
        type: "single",
        x: 18320,
        y: 2998
      },
      {
        type: "single",
        x: 18349,
        y: 1494
      },
      {
        type: "single",
        x: 18398,
        y: 2974
      },
      {
        type: "single",
        x: 18454,
        y: 1269
      },
      {
        type: "single",
        x: 18476,
        y: 2947
      },
      {
        type: "single",
        x: 18554,
        y: 2919
      },
      {
        type: "single",
        x: 18558,
        y: 1036
      },
      {
        type: "single",
        x: 18662,
        y: 798
      },
      {
        type: "ground",
        x: 18737,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 18764,
        y: 559
      },
      {
        type: "single",
        x: 19816,
        y: 613
      },
      {
        type: "single",
        x: 19920,
        y: 822
      },
      {
        type: "single",
        x: 20039,
        y: 1058
      },
      {
        type: "single",
        x: 20141,
        y: 1255
      },
      {
        type: "single",
        x: 20242,
        y: 1446
      },
      {
        type: "single",
        x: 20342,
        y: 1632
      },
      {
        type: "single",
        x: 20442,
        y: 1813
      },
      {
        type: "arc",
        x: 21202,
        y: 1417,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 21451,
        y: 3543
      },
      {
        type: "single",
        x: 21563,
        y: 3718
      },
      {
        type: "single",
        x: 21674,
        y: 3889
      },
      {
        type: "single",
        x: 21785,
        y: 4054
      },
      {
        type: "single",
        x: 21894,
        y: 4215
      },
      {
        type: "single",
        x: 22003,
        y: 4371
      },
      {
        type: "single",
        x: 22111,
        y: 4522
      },
      {
        type: "single",
        x: 22376,
        y: 568
      },
      {
        type: "single",
        x: 22507,
        y: 804
      },
      {
        type: "single",
        x: 22637,
        y: 1023
      },
      {
        type: "single",
        x: 22777,
        y: 1252
      },
      {
        type: "single",
        x: 22856,
        y: 1379
      },
      {
        type: "single",
        x: 22933,
        y: 1502
      },
      {
        type: "single",
        x: 23011,
        y: 1620
      },
      {
        type: "single",
        x: 23157,
        y: 5779
      },
      {
        type: "single",
        x: 23258,
        y: 5880
      },
      {
        type: "single",
        x: 23359,
        y: 5977
      },
      {
        type: "single",
        x: 23459,
        y: 6070
      },
      {
        type: "single",
        x: 23559,
        y: 6159
      },
      {
        type: "single",
        x: 23659,
        y: 6244
      },
      {
        type: "single",
        x: 23758,
        y: 6324
      },
      {
        type: "single",
        x: 24725,
        y: 6750
      },
      {
        type: "single",
        x: 24819,
        y: 6735
      },
      {
        type: "single",
        x: 24914,
        y: 6708
      },
      {
        type: "single",
        x: 25008,
        y: 6671
      },
      {
        type: "single",
        x: 25102,
        y: 6622
      },
      {
        type: "single",
        x: 25195,
        y: 6563
      },
      {
        type: "single",
        x: 25288,
        y: 6492
      },
      {
        type: "single",
        x: 26281,
        y: 5180
      },
      {
        type: "single",
        x: 26368,
        y: 5001
      },
      {
        type: "single",
        x: 26454,
        y: 4813
      },
      {
        type: "single",
        x: 26540,
        y: 4614
      },
      {
        type: "single",
        x: 26625,
        y: 4406
      },
      {
        type: "single",
        x: 26710,
        y: 4188
      },
      {
        type: "single",
        x: 26793,
        y: 3961
      },
      {
        type: "single",
        x: 27252,
        y: 569
      },
      {
        type: "single",
        x: 27350,
        y: 721
      },
      {
        type: "single",
        x: 27447,
        y: 869
      },
      {
        type: "single",
        x: 27543,
        y: 1013
      },
      {
        type: "single",
        x: 27639,
        y: 1152
      },
      {
        type: "ground",
        x: 27655,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 27735,
        y: 1286
      },
      {
        type: "single",
        x: 27829,
        y: 1416
      },
      {
        type: "single",
        x: 28807,
        y: 505
      },
      {
        type: "single",
        x: 28916,
        y: 679
      },
      {
        type: "ground",
        x: 29014,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 29025,
        y: 848
      },
      {
        type: "single",
        x: 29133,
        y: 1012
      },
      {
        type: "single",
        x: 29240,
        y: 1172
      },
      {
        type: "single",
        x: 29347,
        y: 1326
      },
      {
        type: "single",
        x: 29452,
        y: 1475
      },
      {
        type: "single",
        x: 29786,
        y: 3303
      },
      {
        type: "single",
        x: 29891,
        y: 3370
      },
      {
        type: "single",
        x: 29996,
        y: 3433
      },
      {
        type: "single",
        x: 30101,
        y: 3492
      },
      {
        type: "single",
        x: 30205,
        y: 3546
      },
      {
        type: "single",
        x: 30309,
        y: 3597
      },
      {
        type: "single",
        x: 30412,
        y: 3644
      },
      {
        type: "single",
        x: 30476,
        y: 2720
      },
      {
        type: "single",
        x: 30575,
        y: 2820
      },
      {
        type: "single",
        x: 30674,
        y: 2916
      },
      {
        type: "single",
        x: 30772,
        y: 3008
      },
      {
        type: "single",
        x: 30870,
        y: 3096
      },
      {
        type: "single",
        x: 30967,
        y: 3179
      },
      {
        type: "single",
        x: 31064,
        y: 3259
      },
      {
        type: "single",
        x: 32104,
        y: 3867
      },
      {
        type: "single",
        x: 32196,
        y: 3899
      },
      {
        type: "single",
        x: 32288,
        y: 3927
      },
      {
        type: "single",
        x: 32380,
        y: 3951
      },
      {
        type: "single",
        x: 32471,
        y: 3971
      },
      {
        type: "single",
        x: 32563,
        y: 3987
      },
      {
        type: "single",
        x: 32653,
        y: 4e3
      },
      {
        type: "single",
        x: 32982,
        y: 3662
      },
      {
        type: "single",
        x: 33077,
        y: 3627
      },
      {
        type: "single",
        x: 33171,
        y: 3589
      },
      {
        type: "single",
        x: 33265,
        y: 3549
      },
      {
        type: "single",
        x: 33359,
        y: 3507
      },
      {
        type: "single",
        x: 33452,
        y: 3463
      },
      {
        type: "single",
        x: 33545,
        y: 3416
      },
      {
        type: "single",
        x: 33634,
        y: 3924
      },
      {
        type: "single",
        x: 33721,
        y: 3901
      },
      {
        type: "single",
        x: 33808,
        y: 3875
      },
      {
        type: "single",
        x: 33895,
        y: 3847
      },
      {
        type: "single",
        x: 33981,
        y: 3816
      },
      {
        type: "single",
        x: 34068,
        y: 3782
      },
      {
        type: "single",
        x: 34154,
        y: 3746
      }
    ],
    blizzard: {
      speed: 1430,
      accel: 8
    },
    expect: {
      upgrades: {
        flap: 6,
        slide: 6,
        magnet: 4,
        glide: 4,
        scarf: 2
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
        5095,
        5775
      ],
      [
        13593,
        14477
      ],
      [
        15355,
        15665
      ],
      [
        19935,
        20561
      ],
      [
        22531,
        23799
      ]
    ],
    wind: [
      {
        x: 5575,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 12416,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 14277,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 19113,
        w: 320,
        h: 1500,
        power: 1
      }
    ],
    geysers: [],
    rings: [
      {
        x: 3992,
        y: 901,
        r: 100
      },
      {
        x: 6706,
        y: 971,
        r: 100
      },
      {
        x: 8488,
        y: 2751,
        r: 100
      },
      {
        x: 10219,
        y: 2003,
        r: 100
      },
      {
        x: 11928,
        y: 950,
        r: 100
      },
      {
        x: 13694,
        y: 3107,
        r: 100
      },
      {
        x: 15407,
        y: 3547,
        r: 100
      },
      {
        x: 17176,
        y: 1899,
        r: 100
      },
      {
        x: 18912,
        y: 1118,
        r: 100
      },
      {
        x: 20677,
        y: 2215,
        r: 100
      },
      {
        x: 22794,
        y: 1167,
        r: 100
      },
      {
        x: 24601,
        y: 2263,
        r: 100
      },
      {
        x: 28050,
        y: 1562,
        r: 100
      },
      {
        x: 29956,
        y: 1935,
        r: 100
      },
      {
        x: 31750,
        y: 1094,
        r: 100
      },
      {
        x: 33564,
        y: 3328,
        r: 100
      }
    ],
    decor: [
      {
        type: "sign",
        x: 150
      },
      {
        type: "crystal",
        x: 700,
        s: 0.91,
        v: 0
      },
      {
        type: "crystal",
        x: 1352,
        s: 0.85,
        v: 0
      },
      {
        type: "pine",
        x: 1759,
        s: 0.77,
        v: 0
      },
      {
        type: "crystal",
        x: 2343,
        s: 1.04,
        v: 2
      },
      {
        type: "pine",
        x: 2869,
        s: 0.98,
        v: 1
      },
      {
        type: "crystal",
        x: 3302,
        s: 0.77,
        v: 2
      },
      {
        type: "crystal",
        x: 3936,
        s: 0.9,
        v: 1
      },
      {
        type: "pine",
        x: 4676,
        s: 0.9,
        v: 2
      },
      {
        type: "crystal",
        x: 5341,
        s: 0.82,
        v: 2
      },
      {
        type: "crystal",
        x: 6002,
        s: 0.9,
        v: 2
      },
      {
        type: "crystal",
        x: 6422,
        s: 0.8,
        v: 0
      },
      {
        type: "pine",
        x: 7093,
        s: 0.88,
        v: 0
      },
      {
        type: "crystal",
        x: 7547,
        s: 0.87,
        v: 2
      },
      {
        type: "pine",
        x: 7960,
        s: 1.07,
        v: 1
      },
      {
        type: "pine",
        x: 8484,
        s: 1.01,
        v: 2
      },
      {
        type: "crystal",
        x: 9164,
        s: 0.9,
        v: 0
      },
      {
        type: "crystal",
        x: 9680,
        s: 1.05,
        v: 2
      },
      {
        type: "crystal",
        x: 10317,
        s: 0.79,
        v: 2
      },
      {
        type: "crystal",
        x: 10765,
        s: 0.9,
        v: 2
      },
      {
        type: "pine",
        x: 11497,
        s: 0.92,
        v: 1
      },
      {
        type: "pine",
        x: 11940,
        s: 0.9,
        v: 2
      },
      {
        type: "pine",
        x: 12385,
        s: 1.09,
        v: 2
      },
      {
        type: "pine",
        x: 12852,
        s: 1.03,
        v: 1
      },
      {
        type: "crystal",
        x: 13502,
        s: 0.87,
        v: 1
      },
      {
        type: "crystal",
        x: 14002,
        s: 0.77,
        v: 0
      },
      {
        type: "pine",
        x: 14686,
        s: 0.99,
        v: 1
      },
      {
        type: "crystal",
        x: 15382,
        s: 0.91,
        v: 1
      },
      {
        type: "crystal",
        x: 15963,
        s: 1.04,
        v: 0
      },
      {
        type: "crystal",
        x: 16565,
        s: 0.9,
        v: 0
      },
      {
        type: "pine",
        x: 17123,
        s: 0.79,
        v: 1
      },
      {
        type: "pine",
        x: 17512,
        s: 0.98,
        v: 0
      },
      {
        type: "crystal",
        x: 18211,
        s: 0.86,
        v: 2
      },
      {
        type: "crystal",
        x: 18653,
        s: 0.81,
        v: 0
      },
      {
        type: "pine",
        x: 19380,
        s: 0.79,
        v: 2
      },
      {
        type: "pine",
        x: 19949,
        s: 0.98,
        v: 0
      },
      {
        type: "pine",
        x: 20519,
        s: 1.06,
        v: 0
      },
      {
        type: "crystal",
        x: 21003,
        s: 0.78,
        v: 1
      },
      {
        type: "crystal",
        x: 21454,
        s: 0.98,
        v: 1
      },
      {
        type: "crystal",
        x: 21956,
        s: 0.85,
        v: 0
      },
      {
        type: "pine",
        x: 22510,
        s: 0.8,
        v: 2
      },
      {
        type: "crystal",
        x: 23079,
        s: 0.92,
        v: 2
      },
      {
        type: "crystal",
        x: 23569,
        s: 0.86,
        v: 2
      },
      {
        type: "crystal",
        x: 24286,
        s: 0.89,
        v: 2
      },
      {
        type: "pine",
        x: 24677,
        s: 0.85,
        v: 1
      },
      {
        type: "pine",
        x: 25267,
        s: 0.84,
        v: 2
      },
      {
        type: "crystal",
        x: 25914,
        s: 1.09,
        v: 1
      },
      {
        type: "crystal",
        x: 26523,
        s: 0.99,
        v: 0
      },
      {
        type: "crystal",
        x: 26992,
        s: 0.87,
        v: 0
      },
      {
        type: "pine",
        x: 27659,
        s: 0.78,
        v: 1
      },
      {
        type: "pine",
        x: 28270,
        s: 0.86,
        v: 1
      },
      {
        type: "pine",
        x: 28948,
        s: 0.8,
        v: 1
      },
      {
        type: "pine",
        x: 29355,
        s: 0.86,
        v: 2
      },
      {
        type: "pine",
        x: 29772,
        s: 1.08,
        v: 0
      },
      {
        type: "crystal",
        x: 30447,
        s: 0.91,
        v: 1
      },
      {
        type: "crystal",
        x: 30867,
        s: 0.86,
        v: 1
      },
      {
        type: "pine",
        x: 31261,
        s: 1.06,
        v: 1
      },
      {
        type: "pine",
        x: 31776,
        s: 1.08,
        v: 0
      },
      {
        type: "pine",
        x: 32462,
        s: 0.8,
        v: 1
      },
      {
        type: "crystal",
        x: 33101,
        s: 1.08,
        v: 2
      },
      {
        type: "crystal",
        x: 33684,
        s: 1,
        v: 1
      },
      {
        type: "snowman",
        x: 15574,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 34568
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
        653,
        -238
      ],
      [
        1279,
        291
      ],
      [
        1866,
        -227
      ],
      [
        2433,
        242
      ],
      [
        3179,
        -230
      ],
      [
        3965,
        233
      ],
      [
        4754,
        -207
      ],
      [
        5532,
        219
      ],
      [
        6310,
        -232
      ],
      [
        7064,
        212
      ],
      [
        7775,
        -263
      ],
      [
        8494,
        197
      ],
      [
        9295,
        -293
      ],
      [
        10024,
        153
      ],
      [
        10729,
        -304
      ],
      [
        11412,
        121
      ],
      [
        11768,
        -177
      ],
      [
        12121,
        -2
      ],
      [
        12458,
        -226
      ],
      [
        12776,
        -1
      ],
      [
        13104,
        -191
      ],
      [
        13413,
        -18
      ],
      [
        14127,
        -303
      ],
      [
        14881,
        130
      ],
      [
        15655,
        -275
      ],
      [
        16356,
        130
      ],
      [
        17158,
        -294
      ],
      [
        17967,
        129
      ],
      [
        18691,
        -254
      ],
      [
        19414,
        163
      ],
      [
        20138,
        -277
      ],
      [
        20816,
        122
      ],
      [
        21697,
        -442
      ],
      [
        22563,
        351
      ],
      [
        23490,
        -378
      ],
      [
        24410,
        357
      ],
      [
        25163,
        -214
      ],
      [
        25907,
        229
      ],
      [
        26642,
        -239
      ],
      [
        27353,
        195
      ],
      [
        28157,
        -190
      ],
      [
        28930,
        221
      ],
      [
        29691,
        -198
      ],
      [
        30387,
        279
      ],
      [
        31099,
        -203
      ],
      [
        31768,
        239
      ],
      [
        33100,
        -425
      ],
      [
        34452,
        530
      ],
      [
        35172,
        -194
      ],
      [
        35917,
        241
      ],
      [
        36664,
        -179
      ],
      [
        37430,
        219
      ],
      [
        38156,
        -222
      ],
      [
        38840,
        215
      ],
      [
        39480,
        -200
      ],
      [
        40300,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 1162,
        y: 323,
        soar: 1
      },
      {
        type: "single",
        x: 1237,
        y: 436,
        soar: 1
      },
      {
        type: "single",
        x: 1311,
        y: 540,
        soar: 1
      },
      {
        type: "single",
        x: 1385,
        y: 636,
        soar: 1
      },
      {
        type: "single",
        x: 1533,
        y: 800,
        soar: 1
      },
      {
        type: "single",
        x: 1630,
        y: 890,
        soar: 1
      },
      {
        type: "single",
        x: 1727,
        y: 965,
        soar: 1
      },
      {
        type: "single",
        x: 1782,
        y: 1111,
        soar: 1
      },
      {
        type: "single",
        x: 1920,
        y: 1069,
        soar: 1
      },
      {
        type: "single",
        x: 2040,
        y: 1103,
        soar: 1
      },
      {
        type: "single",
        x: 2160,
        y: 1113,
        soar: 1
      },
      {
        type: "single",
        x: 2279,
        y: 1071,
        soar: 1
      },
      {
        type: "single",
        x: 2468,
        y: 950,
        soar: 1
      },
      {
        type: "single",
        x: 2562,
        y: 849,
        soar: 1
      },
      {
        type: "single",
        x: 2632,
        y: 744,
        soar: 1
      },
      {
        type: "single",
        x: 2781,
        y: 1344
      },
      {
        type: "single",
        x: 2893,
        y: 1312
      },
      {
        type: "single",
        x: 3005,
        y: 1270
      },
      {
        type: "single",
        x: 3083,
        y: 1218
      },
      {
        type: "single",
        x: 3116,
        y: 1219
      },
      {
        type: "single",
        x: 3187,
        y: 1152
      },
      {
        type: "single",
        x: 3227,
        y: 1159
      },
      {
        type: "single",
        x: 3290,
        y: 1076
      },
      {
        type: "single",
        x: 3392,
        y: 990
      },
      {
        type: "single",
        x: 3495,
        y: 890
      },
      {
        type: "single",
        x: 3596,
        y: 753
      },
      {
        type: "single",
        x: 3697,
        y: 601
      },
      {
        type: "single",
        x: 5536,
        y: 360
      },
      {
        type: "ground",
        x: 5652,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 5656,
        y: 428
      },
      {
        type: "single",
        x: 5776,
        y: 480
      },
      {
        type: "single",
        x: 5895,
        y: 517
      },
      {
        type: "single",
        x: 6013,
        y: 539
      },
      {
        type: "single",
        x: 6131,
        y: 546
      },
      {
        type: "single",
        x: 6248,
        y: 541
      },
      {
        type: "single",
        x: 6589,
        y: 1314
      },
      {
        type: "single",
        x: 6681,
        y: 1366
      },
      {
        type: "single",
        x: 6773,
        y: 1414
      },
      {
        type: "single",
        x: 6865,
        y: 1458
      },
      {
        type: "single",
        x: 6957,
        y: 1498
      },
      {
        type: "single",
        x: 7048,
        y: 1532
      },
      {
        type: "single",
        x: 7139,
        y: 1556
      },
      {
        type: "ground",
        x: 7184,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 8448,
        y: 367
      },
      {
        type: "single",
        x: 8521,
        y: 458
      },
      {
        type: "single",
        x: 8595,
        y: 545
      },
      {
        type: "ground",
        x: 8614,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 8668,
        y: 628
      },
      {
        type: "single",
        x: 8740,
        y: 707
      },
      {
        type: "single",
        x: 8813,
        y: 782
      },
      {
        type: "single",
        x: 8885,
        y: 853
      },
      {
        type: "single",
        x: 9163,
        y: 854
      },
      {
        type: "single",
        x: 9248,
        y: 796
      },
      {
        type: "single",
        x: 9332,
        y: 736
      },
      {
        type: "single",
        x: 9416,
        y: 673
      },
      {
        type: "single",
        x: 9501,
        y: 608
      },
      {
        type: "single",
        x: 9584,
        y: 542
      },
      {
        type: "single",
        x: 9668,
        y: 473
      },
      {
        type: "single",
        x: 9943,
        y: 843
      },
      {
        type: "single",
        x: 10081,
        y: 674
      },
      {
        type: "ground",
        x: 10144,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 10218,
        y: 462
      },
      {
        type: "single",
        x: 10353,
        y: 208
      },
      {
        type: "single",
        x: 10487,
        y: -64
      },
      {
        type: "single",
        x: 11559,
        y: 530
      },
      {
        type: "single",
        x: 11661,
        y: 642
      },
      {
        type: "single",
        x: 11763,
        y: 750
      },
      {
        type: "single",
        x: 11864,
        y: 854
      },
      {
        type: "single",
        x: 11965,
        y: 954
      },
      {
        type: "single",
        x: 12065,
        y: 1049
      },
      {
        type: "single",
        x: 12164,
        y: 1140
      },
      {
        type: "single",
        x: 12428,
        y: 246
      },
      {
        type: "single",
        x: 12535,
        y: 239
      },
      {
        type: "single",
        x: 12641,
        y: 236
      },
      {
        type: "single",
        x: 12747,
        y: 233
      },
      {
        type: "single",
        x: 12853,
        y: 229
      },
      {
        type: "single",
        x: 12958,
        y: 222
      },
      {
        type: "single",
        x: 13063,
        y: 208
      },
      {
        type: "single",
        x: 13234,
        y: 1820
      },
      {
        type: "single",
        x: 13329,
        y: 1858
      },
      {
        type: "single",
        x: 13424,
        y: 1891
      },
      {
        type: "single",
        x: 13518,
        y: 1917
      },
      {
        type: "single",
        x: 13613,
        y: 1931
      },
      {
        type: "single",
        x: 13706,
        y: 1935
      },
      {
        type: "single",
        x: 13800,
        y: 1927
      },
      {
        type: "single",
        x: 14807,
        y: 1321
      },
      {
        type: "single",
        x: 14897,
        y: 1240
      },
      {
        type: "single",
        x: 14986,
        y: 1157
      },
      {
        type: "single",
        x: 15075,
        y: 1071
      },
      {
        type: "single",
        x: 15163,
        y: 984
      },
      {
        type: "single",
        x: 15251,
        y: 894
      },
      {
        type: "single",
        x: 15339,
        y: 802
      },
      {
        type: "single",
        x: 15650,
        y: 1289
      },
      {
        type: "single",
        x: 15759,
        y: 1387
      },
      {
        type: "single",
        x: 15868,
        y: 1480
      },
      {
        type: "single",
        x: 15976,
        y: 1568
      },
      {
        type: "single",
        x: 16083,
        y: 1653
      },
      {
        type: "single",
        x: 16191,
        y: 1733
      },
      {
        type: "single",
        x: 16297,
        y: 1809
      },
      {
        type: "single",
        x: 16992,
        y: -64
      },
      {
        type: "single",
        x: 17110,
        y: 60
      },
      {
        type: "single",
        x: 17228,
        y: 168
      },
      {
        type: "single",
        x: 17345,
        y: 261
      },
      {
        type: "single",
        x: 17461,
        y: 338
      },
      {
        type: "single",
        x: 17577,
        y: 393
      },
      {
        type: "single",
        x: 17692,
        y: 405
      },
      {
        type: "single",
        x: 17953,
        y: 2343
      },
      {
        type: "single",
        x: 18054,
        y: 2302
      },
      {
        type: "ground",
        x: 18087,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 18154,
        y: 2250
      },
      {
        type: "single",
        x: 18254,
        y: 2189
      },
      {
        type: "single",
        x: 18353,
        y: 2125
      },
      {
        type: "single",
        x: 18453,
        y: 2059
      },
      {
        type: "single",
        x: 18551,
        y: 1982
      },
      {
        type: "single",
        x: 19350,
        y: 308
      },
      {
        type: "single",
        x: 19430,
        y: 401
      },
      {
        type: "single",
        x: 19509,
        y: 489
      },
      {
        type: "single",
        x: 19587,
        y: 573
      },
      {
        type: "single",
        x: 19666,
        y: 650
      },
      {
        type: "single",
        x: 19744,
        y: 715
      },
      {
        type: "single",
        x: 19822,
        y: 771
      },
      {
        type: "single",
        x: 20235,
        y: 20
      },
      {
        type: "single",
        x: 20349,
        y: 92
      },
      {
        type: "single",
        x: 20463,
        y: 160
      },
      {
        type: "single",
        x: 20576,
        y: 224
      },
      {
        type: "single",
        x: 20688,
        y: 284
      },
      {
        type: "single",
        x: 20800,
        y: 340
      },
      {
        type: "single",
        x: 20890,
        y: 891
      },
      {
        type: "single",
        x: 20912,
        y: 392
      },
      {
        type: "single",
        x: 20965,
        y: 864
      },
      {
        type: "single",
        x: 21040,
        y: 833
      },
      {
        type: "single",
        x: 21114,
        y: 800
      },
      {
        type: "single",
        x: 21188,
        y: 765
      },
      {
        type: "single",
        x: 21262,
        y: 728
      },
      {
        type: "single",
        x: 21336,
        y: 688
      },
      {
        type: "single",
        x: 22541,
        y: 518
      },
      {
        type: "arc",
        x: 22643,
        y: 1451,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 22647,
        y: 453
      },
      {
        type: "single",
        x: 22752,
        y: 376
      },
      {
        type: "single",
        x: 22857,
        y: 288
      },
      {
        type: "single",
        x: 22961,
        y: 189
      },
      {
        type: "single",
        x: 23065,
        y: 80
      },
      {
        type: "single",
        x: 23168,
        y: -40
      },
      {
        type: "single",
        x: 24236,
        y: 421
      },
      {
        type: "single",
        x: 24308,
        y: 532
      },
      {
        type: "single",
        x: 24379,
        y: 639
      },
      {
        type: "single",
        x: 24450,
        y: 742
      },
      {
        type: "arc",
        x: 24490,
        y: 1457,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 24521,
        y: 840
      },
      {
        type: "single",
        x: 24592,
        y: 934
      },
      {
        type: "single",
        x: 24662,
        y: 1024
      },
      {
        type: "single",
        x: 24994,
        y: 1622
      },
      {
        type: "single",
        x: 25087,
        y: 1733
      },
      {
        type: "single",
        x: 25179,
        y: 1840
      },
      {
        type: "single",
        x: 25270,
        y: 1940
      },
      {
        type: "single",
        x: 25362,
        y: 2028
      },
      {
        type: "single",
        x: 25453,
        y: 2105
      },
      {
        type: "single",
        x: 25543,
        y: 2170
      },
      {
        type: "single",
        x: 25694,
        y: 1329
      },
      {
        type: "single",
        x: 25828,
        y: 1300
      },
      {
        type: "single",
        x: 25962,
        y: 1260
      },
      {
        type: "single",
        x: 26096,
        y: 1211
      },
      {
        type: "single",
        x: 26229,
        y: 1152
      },
      {
        type: "single",
        x: 26361,
        y: 1082
      },
      {
        type: "single",
        x: 26492,
        y: 1003
      },
      {
        type: "single",
        x: 27216,
        y: 2347
      },
      {
        type: "single",
        x: 27302,
        y: 2326
      },
      {
        type: "single",
        x: 27387,
        y: 2302
      },
      {
        type: "single",
        x: 27473,
        y: 2277
      },
      {
        type: "single",
        x: 27558,
        y: 2249
      },
      {
        type: "single",
        x: 27642,
        y: 2219
      },
      {
        type: "single",
        x: 27727,
        y: 2186
      },
      {
        type: "single",
        x: 28834,
        y: 340
      },
      {
        type: "single",
        x: 28921,
        y: 437
      },
      {
        type: "single",
        x: 29008,
        y: 529
      },
      {
        type: "single",
        x: 29094,
        y: 617
      },
      {
        type: "single",
        x: 29180,
        y: 699
      },
      {
        type: "single",
        x: 29265,
        y: 770
      },
      {
        type: "single",
        x: 29350,
        y: 830
      },
      {
        type: "single",
        x: 30352,
        y: 930
      },
      {
        type: "single",
        x: 30434,
        y: 915
      },
      {
        type: "single",
        x: 30515,
        y: 898
      },
      {
        type: "single",
        x: 30597,
        y: 878
      },
      {
        type: "single",
        x: 30678,
        y: 855
      },
      {
        type: "single",
        x: 30759,
        y: 830
      },
      {
        type: "single",
        x: 30840,
        y: 803
      },
      {
        type: "single",
        x: 31156,
        y: 1656
      },
      {
        type: "single",
        x: 31267,
        y: 1798
      },
      {
        type: "single",
        x: 31377,
        y: 1931
      },
      {
        type: "single",
        x: 31487,
        y: 2052
      },
      {
        type: "single",
        x: 31596,
        y: 2161
      },
      {
        type: "single",
        x: 31705,
        y: 2258
      },
      {
        type: "single",
        x: 31814,
        y: 2343
      },
      {
        type: "single",
        x: 32045,
        y: 297
      },
      {
        type: "single",
        x: 32159,
        y: 251
      },
      {
        type: "single",
        x: 32273,
        y: 196
      },
      {
        type: "single",
        x: 32387,
        y: 130
      },
      {
        type: "single",
        x: 32500,
        y: 54
      },
      {
        type: "single",
        x: 32612,
        y: -31
      },
      {
        type: "single",
        x: 32724,
        y: -126
      },
      {
        type: "single",
        x: 33496,
        y: 2317
      },
      {
        type: "single",
        x: 33598,
        y: 2249
      },
      {
        type: "single",
        x: 33699,
        y: 2171
      },
      {
        type: "single",
        x: 33800,
        y: 2083
      },
      {
        type: "single",
        x: 33901,
        y: 1991
      },
      {
        type: "single",
        x: 34001,
        y: 1896
      },
      {
        type: "single",
        x: 34101,
        y: 1800
      },
      {
        type: "arc",
        x: 34532,
        y: 1630,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 35844,
        y: 390
      },
      {
        type: "single",
        x: 35935,
        y: 501
      },
      {
        type: "single",
        x: 36026,
        y: 608
      },
      {
        type: "single",
        x: 36116,
        y: 711
      },
      {
        type: "single",
        x: 36206,
        y: 809
      },
      {
        type: "single",
        x: 36295,
        y: 904
      },
      {
        type: "single",
        x: 36385,
        y: 994
      },
      {
        type: "single",
        x: 36694,
        y: 222
      },
      {
        type: "single",
        x: 36816,
        y: 324
      },
      {
        type: "single",
        x: 36938,
        y: 410
      },
      {
        type: "single",
        x: 37059,
        y: 461
      },
      {
        type: "single",
        x: 37180,
        y: 485
      },
      {
        type: "single",
        x: 37301,
        y: 493
      },
      {
        type: "single",
        x: 37421,
        y: 474
      },
      {
        type: "single",
        x: 37428,
        y: 1761
      },
      {
        type: "single",
        x: 37513,
        y: 1799
      },
      {
        type: "single",
        x: 37598,
        y: 1833
      },
      {
        type: "single",
        x: 37682,
        y: 1864
      },
      {
        type: "single",
        x: 37766,
        y: 1891
      },
      {
        type: "single",
        x: 37850,
        y: 1913
      },
      {
        type: "single",
        x: 37934,
        y: 1933
      },
      {
        type: "single",
        x: 39001,
        y: 1880
      },
      {
        type: "single",
        x: 39081,
        y: 1857
      },
      {
        type: "single",
        x: 39162,
        y: 1832
      },
      {
        type: "single",
        x: 39242,
        y: 1805
      },
      {
        type: "single",
        x: 39321,
        y: 1775
      },
      {
        type: "single",
        x: 39401,
        y: 1742
      },
      {
        type: "single",
        x: 39480,
        y: 1707
      }
    ],
    blizzard: {
      speed: 1570,
      accel: 9
    },
    expect: {
      upgrades: {
        flap: 7,
        slide: 7,
        magnet: 5,
        glide: 5,
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
        x: 4594,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 10569,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 12298,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 25003,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 27997,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 37996,
        w: 320,
        h: 1500,
        power: 1
      }
    ],
    geysers: [
      {
        x: 11668
      },
      {
        x: 12364
      },
      {
        x: 13927
      },
      {
        x: 16933
      },
      {
        x: 19935
      },
      {
        x: 24952
      },
      {
        x: 26436
      },
      {
        x: 32727
      },
      {
        x: 36455
      }
    ],
    rings: [],
    decor: [
      {
        type: "sign",
        x: 150
      },
      {
        type: "balloon",
        x: 700,
        s: 1.05,
        v: 2
      },
      {
        type: "star",
        x: 1289,
        s: 1.03,
        v: 1
      },
      {
        type: "balloon",
        x: 1747,
        s: 0.82,
        v: 2
      },
      {
        type: "star",
        x: 2208,
        s: 1.03,
        v: 0
      },
      {
        type: "balloon",
        x: 2660,
        s: 0.87,
        v: 1
      },
      {
        type: "star",
        x: 3321,
        s: 1.04,
        v: 1
      },
      {
        type: "star",
        x: 4025,
        s: 0.79,
        v: 2
      },
      {
        type: "balloon",
        x: 4453,
        s: 0.81,
        v: 2
      },
      {
        type: "balloon",
        x: 5058,
        s: 0.78,
        v: 0
      },
      {
        type: "balloon",
        x: 5476,
        s: 0.87,
        v: 0
      },
      {
        type: "balloon",
        x: 6205,
        s: 0.89,
        v: 0
      },
      {
        type: "star",
        x: 6599,
        s: 1.06,
        v: 0
      },
      {
        type: "star",
        x: 7355,
        s: 0.83,
        v: 2
      },
      {
        type: "balloon",
        x: 8100,
        s: 1.02,
        v: 0
      },
      {
        type: "star",
        x: 8511,
        s: 1.03,
        v: 1
      },
      {
        type: "star",
        x: 9063,
        s: 0.82,
        v: 0
      },
      {
        type: "balloon",
        x: 9712,
        s: 0.86,
        v: 1
      },
      {
        type: "balloon",
        x: 10305,
        s: 0.96,
        v: 2
      },
      {
        type: "balloon",
        x: 10856,
        s: 0.85,
        v: 1
      },
      {
        type: "balloon",
        x: 11608,
        s: 1.03,
        v: 0
      },
      {
        type: "balloon",
        x: 12195,
        s: 0.82,
        v: 2
      },
      {
        type: "balloon",
        x: 12770,
        s: 1.04,
        v: 0
      },
      {
        type: "balloon",
        x: 13349,
        s: 1.02,
        v: 0
      },
      {
        type: "balloon",
        x: 13745,
        s: 0.93,
        v: 0
      },
      {
        type: "balloon",
        x: 14411,
        s: 0.85,
        v: 0
      },
      {
        type: "star",
        x: 14873,
        s: 0.78,
        v: 2
      },
      {
        type: "balloon",
        x: 15350,
        s: 0.78,
        v: 1
      },
      {
        type: "star",
        x: 15956,
        s: 0.83,
        v: 0
      },
      {
        type: "balloon",
        x: 16383,
        s: 0.84,
        v: 0
      },
      {
        type: "balloon",
        x: 16873,
        s: 0.96,
        v: 2
      },
      {
        type: "star",
        x: 17355,
        s: 0.76,
        v: 0
      },
      {
        type: "balloon",
        x: 17861,
        s: 1.06,
        v: 0
      },
      {
        type: "balloon",
        x: 18437,
        s: 0.88,
        v: 1
      },
      {
        type: "star",
        x: 19118,
        s: 0.87,
        v: 1
      },
      {
        type: "balloon",
        x: 19676,
        s: 0.82,
        v: 1
      },
      {
        type: "balloon",
        x: 20231,
        s: 0.91,
        v: 2
      },
      {
        type: "balloon",
        x: 20920,
        s: 0.83,
        v: 1
      },
      {
        type: "balloon",
        x: 21607,
        s: 0.91,
        v: 2
      },
      {
        type: "balloon",
        x: 22235,
        s: 1.07,
        v: 0
      },
      {
        type: "balloon",
        x: 22700,
        s: 0.83,
        v: 2
      },
      {
        type: "balloon",
        x: 23251,
        s: 0.9,
        v: 2
      },
      {
        type: "balloon",
        x: 23961,
        s: 0.92,
        v: 0
      },
      {
        type: "star",
        x: 24353,
        s: 0.99,
        v: 2
      },
      {
        type: "balloon",
        x: 25066,
        s: 0.79,
        v: 2
      },
      {
        type: "star",
        x: 25799,
        s: 1.02,
        v: 1
      },
      {
        type: "balloon",
        x: 26548,
        s: 0.96,
        v: 2
      },
      {
        type: "balloon",
        x: 27222,
        s: 0.99,
        v: 1
      },
      {
        type: "star",
        x: 27683,
        s: 0.85,
        v: 2
      },
      {
        type: "balloon",
        x: 28388,
        s: 0.78,
        v: 1
      },
      {
        type: "star",
        x: 28780,
        s: 0.8,
        v: 0
      },
      {
        type: "balloon",
        x: 29384,
        s: 1.05,
        v: 0
      },
      {
        type: "balloon",
        x: 29953,
        s: 0.98,
        v: 1
      },
      {
        type: "balloon",
        x: 30509,
        s: 0.99,
        v: 0
      },
      {
        type: "star",
        x: 31035,
        s: 1,
        v: 2
      },
      {
        type: "balloon",
        x: 31635,
        s: 1.09,
        v: 2
      },
      {
        type: "star",
        x: 32019,
        s: 0.96,
        v: 0
      },
      {
        type: "star",
        x: 32631,
        s: 0.85,
        v: 1
      },
      {
        type: "star",
        x: 33041,
        s: 0.79,
        v: 2
      },
      {
        type: "balloon",
        x: 33472,
        s: 0.88,
        v: 2
      },
      {
        type: "star",
        x: 34155,
        s: 0.99,
        v: 2
      },
      {
        type: "balloon",
        x: 34680,
        s: 0.96,
        v: 0
      },
      {
        type: "balloon",
        x: 35076,
        s: 1.03,
        v: 0
      },
      {
        type: "star",
        x: 35623,
        s: 0.8,
        v: 2
      },
      {
        type: "star",
        x: 36351,
        s: 0.79,
        v: 1
      },
      {
        type: "balloon",
        x: 36966,
        s: 1.1,
        v: 2
      },
      {
        type: "star",
        x: 37475,
        s: 1.02,
        v: 2
      },
      {
        type: "balloon",
        x: 37912,
        s: 0.99,
        v: 0
      },
      {
        type: "balloon",
        x: 38377,
        s: 0.92,
        v: 1
      },
      {
        type: "star",
        x: 38789,
        s: 0.87,
        v: 0
      },
      {
        type: "balloon",
        x: 39226,
        s: 1.06,
        v: 1
      },
      {
        type: "snowman",
        x: 18135,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 40260
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
        670,
        -304
      ],
      [
        1390,
        233
      ],
      [
        2056,
        -296
      ],
      [
        2747,
        199
      ],
      [
        3437,
        -351
      ],
      [
        4105,
        222
      ],
      [
        4757,
        -407
      ],
      [
        5371,
        214
      ],
      [
        6053,
        -407
      ],
      [
        6685,
        167
      ],
      [
        7334,
        -431
      ],
      [
        7977,
        191
      ],
      [
        9355,
        -564
      ],
      [
        10650,
        362
      ],
      [
        12038,
        -550
      ],
      [
        13524,
        414
      ],
      [
        13851,
        -196
      ],
      [
        14199,
        -11
      ],
      [
        14550,
        -179
      ],
      [
        14893,
        27
      ],
      [
        15252,
        -152
      ],
      [
        15613,
        60
      ],
      [
        16569,
        -459
      ],
      [
        17573,
        346
      ],
      [
        18500,
        -453
      ],
      [
        19408,
        276
      ],
      [
        19847,
        80
      ],
      [
        20287,
        386
      ],
      [
        20735,
        190
      ],
      [
        21184,
        496
      ],
      [
        21636,
        316
      ],
      [
        22087,
        606
      ],
      [
        22722,
        -306
      ],
      [
        23388,
        137
      ],
      [
        24002,
        -355
      ],
      [
        24658,
        128
      ],
      [
        25286,
        -340
      ],
      [
        25871,
        123
      ],
      [
        26461,
        -390
      ],
      [
        27014,
        150
      ],
      [
        27905,
        -484
      ],
      [
        28717,
        244
      ],
      [
        29668,
        -509
      ],
      [
        30620,
        304
      ],
      [
        31269,
        -373
      ],
      [
        31948,
        204
      ],
      [
        32603,
        -373
      ],
      [
        33199,
        219
      ],
      [
        33914,
        -371
      ],
      [
        34634,
        258
      ],
      [
        35332,
        -421
      ],
      [
        36007,
        236
      ],
      [
        37402,
        -537
      ],
      [
        38776,
        413
      ],
      [
        40051,
        -480
      ],
      [
        41408,
        417
      ],
      [
        42359,
        -431
      ],
      [
        43342,
        343
      ],
      [
        44274,
        -452
      ],
      [
        45126,
        335
      ],
      [
        45766,
        -200
      ],
      [
        46586,
        700
      ]
    ],
    fish: [
      {
        type: "single",
        x: 1263,
        y: 271,
        soar: 1
      },
      {
        type: "single",
        x: 1343,
        y: 378,
        soar: 1
      },
      {
        type: "single",
        x: 1423,
        y: 477,
        soar: 1
      },
      {
        type: "single",
        x: 1582,
        y: 647,
        soar: 1
      },
      {
        type: "single",
        x: 1765,
        y: 802,
        soar: 1
      },
      {
        type: "single",
        x: 1869,
        y: 869,
        soar: 1
      },
      {
        type: "single",
        x: 1933,
        y: 1035,
        soar: 1
      },
      {
        type: "single",
        x: 2077,
        y: 958,
        soar: 1
      },
      {
        type: "single",
        x: 2308,
        y: 987,
        soar: 1
      },
      {
        type: "single",
        x: 2436,
        y: 975,
        soar: 1
      },
      {
        type: "single",
        x: 2639,
        y: 863,
        soar: 1
      },
      {
        type: "single",
        x: 2740,
        y: 769,
        soar: 1
      },
      {
        type: "single",
        x: 2816,
        y: 668,
        soar: 1
      },
      {
        type: "ground",
        x: 2867,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 2891,
        y: 543,
        soar: 1
      },
      {
        type: "single",
        x: 2990,
        y: 339,
        soar: 1
      },
      {
        type: "single",
        x: 4049,
        y: 435
      },
      {
        type: "single",
        x: 4147,
        y: 610
      },
      {
        type: "single",
        x: 4244,
        y: 780
      },
      {
        type: "single",
        x: 4341,
        y: 945
      },
      {
        type: "single",
        x: 4437,
        y: 1105
      },
      {
        type: "single",
        x: 4533,
        y: 1261
      },
      {
        type: "single",
        x: 4628,
        y: 1412
      },
      {
        type: "single",
        x: 4915,
        y: 1902
      },
      {
        type: "single",
        x: 5014,
        y: 2031
      },
      {
        type: "single",
        x: 5113,
        y: 2149
      },
      {
        type: "single",
        x: 5212,
        y: 2254
      },
      {
        type: "single",
        x: 5310,
        y: 2348
      },
      {
        type: "single",
        x: 5408,
        y: 2430
      },
      {
        type: "single",
        x: 5506,
        y: 2501
      },
      {
        type: "single",
        x: 5641,
        y: 2753
      },
      {
        type: "single",
        x: 5731,
        y: 2828
      },
      {
        type: "single",
        x: 5820,
        y: 2891
      },
      {
        type: "single",
        x: 5909,
        y: 2943
      },
      {
        type: "single",
        x: 5997,
        y: 2984
      },
      {
        type: "single",
        x: 6086,
        y: 3013
      },
      {
        type: "single",
        x: 6174,
        y: 3031
      },
      {
        type: "arc",
        x: 6765,
        y: 1367,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "ground",
        x: 6805,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 7197,
        y: 2568
      },
      {
        type: "single",
        x: 7281,
        y: 2460
      },
      {
        type: "single",
        x: 7365,
        y: 2344
      },
      {
        type: "single",
        x: 7449,
        y: 2226
      },
      {
        type: "single",
        x: 7532,
        y: 2106
      },
      {
        type: "single",
        x: 7615,
        y: 1984
      },
      {
        type: "single",
        x: 7698,
        y: 1861
      },
      {
        type: "single",
        x: 8017,
        y: 1734
      },
      {
        type: "arc",
        x: 8057,
        y: 1391,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 8106,
        y: 1587
      },
      {
        type: "single",
        x: 8194,
        y: 1429
      },
      {
        type: "single",
        x: 8282,
        y: 1260
      },
      {
        type: "single",
        x: 8370,
        y: 1083
      },
      {
        type: "single",
        x: 8457,
        y: 903
      },
      {
        type: "single",
        x: 8544,
        y: 722
      },
      {
        type: "single",
        x: 10384,
        y: 445
      },
      {
        type: "single",
        x: 10480,
        y: 587
      },
      {
        type: "single",
        x: 10575,
        y: 725
      },
      {
        type: "single",
        x: 10671,
        y: 858
      },
      {
        type: "single",
        x: 10765,
        y: 987
      },
      {
        type: "single",
        x: 10859,
        y: 1112
      },
      {
        type: "single",
        x: 10953,
        y: 1232
      },
      {
        type: "single",
        x: 11260,
        y: 1693
      },
      {
        type: "single",
        x: 11360,
        y: 1817
      },
      {
        type: "single",
        x: 11460,
        y: 1935
      },
      {
        type: "single",
        x: 11559,
        y: 2050
      },
      {
        type: "single",
        x: 11658,
        y: 2160
      },
      {
        type: "single",
        x: 11756,
        y: 2266
      },
      {
        type: "single",
        x: 11854,
        y: 2368
      },
      {
        type: "single",
        x: 11956,
        y: 2272
      },
      {
        type: "single",
        x: 12045,
        y: 2332
      },
      {
        type: "single",
        x: 12134,
        y: 2383
      },
      {
        type: "single",
        x: 12223,
        y: 2429
      },
      {
        type: "single",
        x: 12311,
        y: 2470
      },
      {
        type: "single",
        x: 12399,
        y: 2501
      },
      {
        type: "single",
        x: 12486,
        y: 2521
      },
      {
        type: "single",
        x: 13519,
        y: 2474
      },
      {
        type: "single",
        x: 13603,
        y: 2437
      },
      {
        type: "single",
        x: 13687,
        y: 2388
      },
      {
        type: "single",
        x: 13771,
        y: 2329
      },
      {
        type: "single",
        x: 13855,
        y: 2264
      },
      {
        type: "single",
        x: 13938,
        y: 2197
      },
      {
        type: "single",
        x: 14021,
        y: 2128
      },
      {
        type: "single",
        x: 14288,
        y: 3143
      },
      {
        type: "single",
        x: 14378,
        y: 3089
      },
      {
        type: "single",
        x: 14468,
        y: 3024
      },
      {
        type: "single",
        x: 14557,
        y: 2948
      },
      {
        type: "single",
        x: 14646,
        y: 2861
      },
      {
        type: "single",
        x: 14735,
        y: 2764
      },
      {
        type: "single",
        x: 14824,
        y: 2655
      },
      {
        type: "single",
        x: 15072,
        y: 874
      },
      {
        type: "single",
        x: 15150,
        y: 757
      },
      {
        type: "single",
        x: 15228,
        y: 638
      },
      {
        type: "single",
        x: 15306,
        y: 518
      },
      {
        type: "single",
        x: 15383,
        y: 395
      },
      {
        type: "single",
        x: 15460,
        y: 271
      },
      {
        type: "single",
        x: 15537,
        y: 144
      },
      {
        type: "ground",
        x: 15733,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 17324,
        y: 367
      },
      {
        type: "single",
        x: 17429,
        y: 545
      },
      {
        type: "single",
        x: 17533,
        y: 711
      },
      {
        type: "single",
        x: 17637,
        y: 869
      },
      {
        type: "single",
        x: 17740,
        y: 1022
      },
      {
        type: "single",
        x: 17842,
        y: 1171
      },
      {
        type: "single",
        x: 17944,
        y: 1315
      },
      {
        type: "single",
        x: 19211,
        y: 321
      },
      {
        type: "single",
        x: 19291,
        y: 453
      },
      {
        type: "single",
        x: 19371,
        y: 580
      },
      {
        type: "single",
        x: 19450,
        y: 702
      },
      {
        type: "arc",
        x: 19488,
        y: 1476,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 19529,
        y: 821
      },
      {
        type: "single",
        x: 19607,
        y: 935
      },
      {
        type: "single",
        x: 19686,
        y: 1045
      },
      {
        type: "single",
        x: 19985,
        y: 3148
      },
      {
        type: "single",
        x: 20079,
        y: 3185
      },
      {
        type: "single",
        x: 20172,
        y: 3214
      },
      {
        type: "single",
        x: 20265,
        y: 3232
      },
      {
        type: "single",
        x: 20373,
        y: 3243
      },
      {
        type: "single",
        x: 20465,
        y: 3248
      },
      {
        type: "single",
        x: 20558,
        y: 3250
      },
      {
        type: "single",
        x: 20755,
        y: 1494
      },
      {
        type: "single",
        x: 20830,
        y: 1467
      },
      {
        type: "single",
        x: 20904,
        y: 1433
      },
      {
        type: "single",
        x: 20979,
        y: 1388
      },
      {
        type: "single",
        x: 21053,
        y: 1334
      },
      {
        type: "single",
        x: 21127,
        y: 1279
      },
      {
        type: "single",
        x: 21201,
        y: 1221
      },
      {
        type: "ground",
        x: 22207,
        n: 5,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 22261,
        y: 945
      },
      {
        type: "single",
        x: 22347,
        y: 942
      },
      {
        type: "single",
        x: 22433,
        y: 935
      },
      {
        type: "single",
        x: 22519,
        y: 927
      },
      {
        type: "single",
        x: 22605,
        y: 916
      },
      {
        type: "single",
        x: 22690,
        y: 895
      },
      {
        type: "single",
        x: 22776,
        y: 863
      },
      {
        type: "single",
        x: 23115,
        y: 1380
      },
      {
        type: "single",
        x: 23198,
        y: 1187
      },
      {
        type: "single",
        x: 23280,
        y: 992
      },
      {
        type: "single",
        x: 23362,
        y: 796
      },
      {
        type: "single",
        x: 23443,
        y: 599
      },
      {
        type: "single",
        x: 23524,
        y: 401
      },
      {
        type: "single",
        x: 23604,
        y: 202
      },
      {
        type: "single",
        x: 24590,
        y: 292
      },
      {
        type: "single",
        x: 24685,
        y: 439
      },
      {
        type: "single",
        x: 24779,
        y: 581
      },
      {
        type: "single",
        x: 24873,
        y: 712
      },
      {
        type: "single",
        x: 24966,
        y: 831
      },
      {
        type: "single",
        x: 25058,
        y: 939
      },
      {
        type: "single",
        x: 25151,
        y: 1034
      },
      {
        type: "single",
        x: 25447,
        y: 1587
      },
      {
        type: "single",
        x: 25558,
        y: 1713
      },
      {
        type: "single",
        x: 25669,
        y: 1827
      },
      {
        type: "single",
        x: 25779,
        y: 1929
      },
      {
        type: "single",
        x: 25889,
        y: 2019
      },
      {
        type: "ground",
        x: 25991,
        n: 4,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 25998,
        y: 2098
      },
      {
        type: "single",
        x: 26107,
        y: 2166
      },
      {
        type: "single",
        x: 26233,
        y: 1335
      },
      {
        type: "single",
        x: 26322,
        y: 1303
      },
      {
        type: "single",
        x: 26410,
        y: 1259
      },
      {
        type: "single",
        x: 26498,
        y: 1203
      },
      {
        type: "single",
        x: 26586,
        y: 1137
      },
      {
        type: "single",
        x: 26673,
        y: 1060
      },
      {
        type: "single",
        x: 26760,
        y: 972
      },
      {
        type: "ground",
        x: 27134,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 27801,
        y: 1890
      },
      {
        type: "single",
        x: 27903,
        y: 1787
      },
      {
        type: "single",
        x: 28006,
        y: 1673
      },
      {
        type: "single",
        x: 28107,
        y: 1549
      },
      {
        type: "single",
        x: 28209,
        y: 1414
      },
      {
        type: "single",
        x: 28309,
        y: 1268
      },
      {
        type: "single",
        x: 28410,
        y: 1118
      },
      {
        type: "single",
        x: 28529,
        y: 278
      },
      {
        type: "single",
        x: 28624,
        y: 457
      },
      {
        type: "single",
        x: 28719,
        y: 631
      },
      {
        type: "single",
        x: 28814,
        y: 800
      },
      {
        type: "single",
        x: 28908,
        y: 965
      },
      {
        type: "single",
        x: 29001,
        y: 1124
      },
      {
        type: "single",
        x: 29094,
        y: 1279
      },
      {
        type: "single",
        x: 30125,
        y: 2506
      },
      {
        type: "single",
        x: 30232,
        y: 2599
      },
      {
        type: "single",
        x: 30338,
        y: 2685
      },
      {
        type: "single",
        x: 30444,
        y: 2760
      },
      {
        type: "single",
        x: 30549,
        y: 2824
      },
      {
        type: "single",
        x: 30654,
        y: 2876
      },
      {
        type: "single",
        x: 30759,
        y: 2916
      },
      {
        type: "single",
        x: 31019,
        y: 1436
      },
      {
        type: "single",
        x: 31118,
        y: 1594
      },
      {
        type: "single",
        x: 31216,
        y: 1748
      },
      {
        type: "single",
        x: 31313,
        y: 1897
      },
      {
        type: "single",
        x: 31410,
        y: 2042
      },
      {
        type: "single",
        x: 31506,
        y: 2182
      },
      {
        type: "single",
        x: 31602,
        y: 2318
      },
      {
        type: "single",
        x: 31786,
        y: 2854
      },
      {
        type: "single",
        x: 31887,
        y: 2811
      },
      {
        type: "single",
        x: 31987,
        y: 2765
      },
      {
        type: "arc",
        x: 32028,
        y: 1404,
        w: 760,
        h: 260,
        n: 9,
        gold: true
      },
      {
        type: "single",
        x: 32087,
        y: 2717
      },
      {
        type: "single",
        x: 32187,
        y: 2667
      },
      {
        type: "single",
        x: 32286,
        y: 2615
      },
      {
        type: "single",
        x: 32385,
        y: 2560
      },
      {
        type: "single",
        x: 33450,
        y: 1765
      },
      {
        type: "single",
        x: 33544,
        y: 1665
      },
      {
        type: "single",
        x: 33638,
        y: 1564
      },
      {
        type: "single",
        x: 33732,
        y: 1460
      },
      {
        type: "single",
        x: 33825,
        y: 1355
      },
      {
        type: "single",
        x: 33917,
        y: 1247
      },
      {
        type: "single",
        x: 34010,
        y: 1138
      },
      {
        type: "single",
        x: 34328,
        y: 1849
      },
      {
        type: "single",
        x: 34414,
        y: 1721
      },
      {
        type: "single",
        x: 34499,
        y: 1590
      },
      {
        type: "single",
        x: 34584,
        y: 1459
      },
      {
        type: "single",
        x: 34669,
        y: 1325
      },
      {
        type: "single",
        x: 34753,
        y: 1190
      },
      {
        type: "single",
        x: 34837,
        y: 1054
      },
      {
        type: "single",
        x: 35044,
        y: 173
      },
      {
        type: "single",
        x: 35148,
        y: 144
      },
      {
        type: "single",
        x: 35252,
        y: 113
      },
      {
        type: "single",
        x: 35356,
        y: 80
      },
      {
        type: "single",
        x: 35459,
        y: 44
      },
      {
        type: "single",
        x: 35562,
        y: 6
      },
      {
        type: "single",
        x: 38593,
        y: 521
      },
      {
        type: "single",
        x: 38663,
        y: 589
      },
      {
        type: "single",
        x: 38733,
        y: 653
      },
      {
        type: "single",
        x: 38803,
        y: 714
      },
      {
        type: "ground",
        x: 38896,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 38943,
        y: 822
      },
      {
        type: "single",
        x: 39082,
        y: 916
      },
      {
        type: "single",
        x: 39220,
        y: 994
      },
      {
        type: "single",
        x: 39549,
        y: 1734
      },
      {
        type: "single",
        x: 39656,
        y: 1829
      },
      {
        type: "single",
        x: 39763,
        y: 1920
      },
      {
        type: "single",
        x: 39869,
        y: 2007
      },
      {
        type: "single",
        x: 39975,
        y: 2090
      },
      {
        type: "single",
        x: 40080,
        y: 2168
      },
      {
        type: "single",
        x: 40185,
        y: 2243
      },
      {
        type: "single",
        x: 40235,
        y: 1114
      },
      {
        type: "single",
        x: 40367,
        y: 1081
      },
      {
        type: "single",
        x: 40500,
        y: 1039
      },
      {
        type: "single",
        x: 40631,
        y: 972
      },
      {
        type: "single",
        x: 40762,
        y: 873
      },
      {
        type: "single",
        x: 40892,
        y: 765
      },
      {
        type: "single",
        x: 41022,
        y: 647
      },
      {
        type: "single",
        x: 41815,
        y: 2883
      },
      {
        type: "single",
        x: 41914,
        y: 2870
      },
      {
        type: "single",
        x: 42013,
        y: 2847
      },
      {
        type: "single",
        x: 42111,
        y: 2816
      },
      {
        type: "single",
        x: 42210,
        y: 2784
      },
      {
        type: "single",
        x: 42308,
        y: 2746
      },
      {
        type: "single",
        x: 42405,
        y: 2697
      },
      {
        type: "single",
        x: 43184,
        y: 470
      },
      {
        type: "single",
        x: 43261,
        y: 590
      },
      {
        type: "single",
        x: 43338,
        y: 706
      },
      {
        type: "single",
        x: 43414,
        y: 817
      },
      {
        type: "ground",
        x: 43462,
        n: 6,
        spacing: 90,
        off: 52
      },
      {
        type: "single",
        x: 43490,
        y: 924
      },
      {
        type: "single",
        x: 43566,
        y: 1027
      },
      {
        type: "single",
        x: 43642,
        y: 1125
      },
      {
        type: "single",
        x: 44015,
        y: 1388
      },
      {
        type: "single",
        x: 44106,
        y: 1277
      },
      {
        type: "single",
        x: 44197,
        y: 1165
      },
      {
        type: "single",
        x: 44288,
        y: 1051
      },
      {
        type: "single",
        x: 44378,
        y: 935
      },
      {
        type: "single",
        x: 44468,
        y: 818
      },
      {
        type: "single",
        x: 44558,
        y: 699
      },
      {
        type: "single",
        x: 44670,
        y: 2083
      },
      {
        type: "single",
        x: 44742,
        y: 2122
      },
      {
        type: "single",
        x: 44814,
        y: 2158
      },
      {
        type: "single",
        x: 44885,
        y: 2189
      },
      {
        type: "single",
        x: 44957,
        y: 2216
      },
      {
        type: "single",
        x: 45028,
        y: 2240
      },
      {
        type: "single",
        x: 45099,
        y: 2260
      }
    ],
    blizzard: {
      speed: 1680,
      accel: 10
    },
    expect: {
      upgrades: {
        flap: 8,
        slide: 8,
        magnet: 6,
        glide: 6,
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
        8037,
        9395
      ],
      [
        13584,
        13891
      ],
      [
        23448,
        24042
      ],
      [
        27074,
        27945
      ],
      [
        28777,
        29708
      ],
      [
        30680,
        31309
      ],
      [
        38836,
        40091
      ],
      [
        43402,
        44314
      ]
    ],
    wind: [
      {
        x: 11878,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 21476,
        w: 320,
        h: 1500,
        power: 1
      },
      {
        x: 32443,
        w: 320,
        h: 1500,
        power: 1
      }
    ],
    geysers: [
      {
        x: 14452
      },
      {
        x: 26296
      },
      {
        x: 31087
      }
    ],
    rings: [
      {
        x: 3195,
        y: 1408,
        r: 100
      },
      {
        x: 5815,
        y: 874,
        r: 100
      },
      {
        x: 8267,
        y: 728,
        r: 100
      },
      {
        x: 14068,
        y: 1200,
        r: 100
      },
      {
        x: 17760,
        y: 874,
        r: 100
      },
      {
        x: 19670,
        y: 1218,
        r: 100
      },
      {
        x: 21676,
        y: 922,
        r: 100
      },
      {
        x: 23888,
        y: 1008,
        r: 100
      },
      {
        x: 25634,
        y: 2509,
        r: 100
      },
      {
        x: 27528,
        y: 726,
        r: 100
      },
      {
        x: 29481,
        y: 1763,
        r: 100
      },
      {
        x: 31485,
        y: 2529,
        r: 100
      },
      {
        x: 33193,
        y: 1082,
        r: 100
      },
      {
        x: 34903,
        y: 908,
        r: 100
      },
      {
        x: 36667,
        y: 3347,
        r: 100
      },
      {
        x: 38555,
        y: 2794,
        r: 100
      },
      {
        x: 41903,
        y: 1450,
        r: 100
      },
      {
        x: 44262,
        y: 3157,
        r: 100
      },
      {
        x: 46440,
        y: 2725,
        r: 100
      }
    ],
    decor: [
      {
        type: "sign",
        x: 150
      },
      {
        type: "star",
        x: 700,
        s: 0.9,
        v: 2
      },
      {
        type: "crystal",
        x: 1209,
        s: 0.89,
        v: 1
      },
      {
        type: "crystal",
        x: 1793,
        s: 1.07,
        v: 0
      },
      {
        type: "crystal",
        x: 2425,
        s: 1.05,
        v: 1
      },
      {
        type: "star",
        x: 2976,
        s: 1.06,
        v: 2
      },
      {
        type: "crystal",
        x: 3528,
        s: 0.85,
        v: 1
      },
      {
        type: "crystal",
        x: 4223,
        s: 0.92,
        v: 0
      },
      {
        type: "crystal",
        x: 4861,
        s: 0.99,
        v: 1
      },
      {
        type: "crystal",
        x: 5435,
        s: 1.05,
        v: 1
      },
      {
        type: "crystal",
        x: 5885,
        s: 1.01,
        v: 0
      },
      {
        type: "star",
        x: 6472,
        s: 0.75,
        v: 1
      },
      {
        type: "star",
        x: 6983,
        s: 0.75,
        v: 2
      },
      {
        type: "star",
        x: 7430,
        s: 1.04,
        v: 0
      },
      {
        type: "crystal",
        x: 8124,
        s: 0.82,
        v: 2
      },
      {
        type: "crystal",
        x: 8692,
        s: 0.86,
        v: 1
      },
      {
        type: "crystal",
        x: 9149,
        s: 0.94,
        v: 0
      },
      {
        type: "crystal",
        x: 9591,
        s: 1.09,
        v: 2
      },
      {
        type: "star",
        x: 10220,
        s: 1.08,
        v: 2
      },
      {
        type: "star",
        x: 10850,
        s: 0.86,
        v: 2
      },
      {
        type: "crystal",
        x: 11358,
        s: 0.85,
        v: 1
      },
      {
        type: "crystal",
        x: 12114,
        s: 0.85,
        v: 1
      },
      {
        type: "star",
        x: 12651,
        s: 0.92,
        v: 1
      },
      {
        type: "crystal",
        x: 13305,
        s: 0.86,
        v: 1
      },
      {
        type: "star",
        x: 13738,
        s: 0.85,
        v: 0
      },
      {
        type: "star",
        x: 14125,
        s: 0.99,
        v: 0
      },
      {
        type: "crystal",
        x: 14579,
        s: 0.86,
        v: 0
      },
      {
        type: "crystal",
        x: 15273,
        s: 1.01,
        v: 1
      },
      {
        type: "crystal",
        x: 15772,
        s: 0.87,
        v: 0
      },
      {
        type: "crystal",
        x: 16496,
        s: 0.83,
        v: 1
      },
      {
        type: "crystal",
        x: 17200,
        s: 0.95,
        v: 0
      },
      {
        type: "crystal",
        x: 17750,
        s: 0.93,
        v: 0
      },
      {
        type: "crystal",
        x: 18466,
        s: 0.89,
        v: 1
      },
      {
        type: "crystal",
        x: 19063,
        s: 0.94,
        v: 1
      },
      {
        type: "crystal",
        x: 19729,
        s: 0.98,
        v: 2
      },
      {
        type: "crystal",
        x: 20440,
        s: 0.97,
        v: 0
      },
      {
        type: "crystal",
        x: 20962,
        s: 1.04,
        v: 0
      },
      {
        type: "star",
        x: 21464,
        s: 0.88,
        v: 2
      },
      {
        type: "star",
        x: 21849,
        s: 0.76,
        v: 0
      },
      {
        type: "star",
        x: 22517,
        s: 0.75,
        v: 2
      },
      {
        type: "crystal",
        x: 23004,
        s: 1.06,
        v: 0
      },
      {
        type: "crystal",
        x: 23428,
        s: 0.84,
        v: 2
      },
      {
        type: "star",
        x: 23908,
        s: 1.04,
        v: 2
      },
      {
        type: "star",
        x: 24507,
        s: 0.97,
        v: 2
      },
      {
        type: "crystal",
        x: 24911,
        s: 0.94,
        v: 1
      },
      {
        type: "crystal",
        x: 25475,
        s: 1.05,
        v: 1
      },
      {
        type: "crystal",
        x: 26108,
        s: 0.92,
        v: 1
      },
      {
        type: "star",
        x: 26583,
        s: 0.99,
        v: 2
      },
      {
        type: "crystal",
        x: 26969,
        s: 0.86,
        v: 1
      },
      {
        type: "crystal",
        x: 27563,
        s: 1.01,
        v: 1
      },
      {
        type: "crystal",
        x: 28229,
        s: 0.77,
        v: 2
      },
      {
        type: "crystal",
        x: 28852,
        s: 1.04,
        v: 0
      },
      {
        type: "star",
        x: 29492,
        s: 0.97,
        v: 0
      },
      {
        type: "star",
        x: 30180,
        s: 0.91,
        v: 1
      },
      {
        type: "crystal",
        x: 30759,
        s: 1.08,
        v: 0
      },
      {
        type: "crystal",
        x: 31142,
        s: 0.82,
        v: 1
      },
      {
        type: "crystal",
        x: 31839,
        s: 1.09,
        v: 0
      },
      {
        type: "crystal",
        x: 32344,
        s: 0.8,
        v: 0
      },
      {
        type: "star",
        x: 32775,
        s: 1.03,
        v: 0
      },
      {
        type: "crystal",
        x: 33379,
        s: 1.07,
        v: 2
      },
      {
        type: "star",
        x: 33785,
        s: 1.04,
        v: 0
      },
      {
        type: "star",
        x: 34503,
        s: 0.94,
        v: 1
      },
      {
        type: "star",
        x: 35120,
        s: 1.07,
        v: 1
      },
      {
        type: "star",
        x: 35777,
        s: 0.81,
        v: 2
      },
      {
        type: "crystal",
        x: 36498,
        s: 0.93,
        v: 2
      },
      {
        type: "star",
        x: 36891,
        s: 1.03,
        v: 1
      },
      {
        type: "crystal",
        x: 37496,
        s: 0.98,
        v: 1
      },
      {
        type: "crystal",
        x: 37880,
        s: 1.07,
        v: 2
      },
      {
        type: "crystal",
        x: 38364,
        s: 1,
        v: 1
      },
      {
        type: "star",
        x: 39115,
        s: 0.91,
        v: 2
      },
      {
        type: "crystal",
        x: 39756,
        s: 1.06,
        v: 1
      },
      {
        type: "crystal",
        x: 40481,
        s: 1.02,
        v: 2
      },
      {
        type: "crystal",
        x: 41138,
        s: 0.9,
        v: 1
      },
      {
        type: "crystal",
        x: 41597,
        s: 0.88,
        v: 2
      },
      {
        type: "star",
        x: 42117,
        s: 1.05,
        v: 0
      },
      {
        type: "crystal",
        x: 42565,
        s: 0.92,
        v: 0
      },
      {
        type: "star",
        x: 43040,
        s: 0.88,
        v: 0
      },
      {
        type: "crystal",
        x: 43759,
        s: 0.88,
        v: 0
      },
      {
        type: "crystal",
        x: 44225,
        s: 0.93,
        v: 0
      },
      {
        type: "crystal",
        x: 44727,
        s: 0.76,
        v: 1
      },
      {
        type: "star",
        x: 45266,
        s: 0.97,
        v: 1
      },
      {
        type: "crystal",
        x: 45972,
        s: 0.76,
        v: 2
      },
      {
        type: "snowman",
        x: 20964,
        s: 0.9,
        v: 0
      },
      {
        type: "flag",
        x: 46546
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
    const add = (x, y, gold = false, soar = false) => out.push({ x: ox + x, y, gold, soar, taken: false, pull: 0 });
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
        add(f.x, f.y, !!f.gold, !!f.soar);
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
      this.blizzard = Object.assign({ speed: 700, accel: 6 }, level2.blizzard || {});
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
      const startMul = Math.max(modifiers.startSpeedMul || 1, startIndex > 0 ? 2.6 : 1);
      const fast = startMul > 1.5;
      const sx0 = fast ? isl.startX + (isl.xs[1] - isl.xs[0]) * 0.56 : isl.startX + 4;
      const p = {
        x: sx0,
        y: 0,
        vx: 0,
        vy: 0,
        s: this.P.startSpeed * startMul,
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
      isl.sample(p.x, tmp);
      p.slope = tmp[1];
      this.p = p;
      this.blizzardX = p.x - this.startGapFor(isl);
      this.blizzardV = 0;
      this.blizzardHold = tutorial ? balance.blizzard.tutorialDelay : balance.blizzard.startHold;
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
    // The chase is measured in time, not distance: the same seconds of breathing room on every
    // island, whether the blizzard moves at 500 or 1600 units/s.
    blizzardBase(isl = this.island) {
      return Math.max(300, isl.blizzard.speed * (1 - this.assist) * (this.modifiers.blizzardMul || 1));
    }
    maxGap(isl = this.island) {
      return this.balance.blizzard.maxGapSec * this.blizzardBase(isl);
    }
    dangerGap(isl = this.island) {
      return this.balance.blizzard.dangerSec * this.blizzardBase(isl);
    }
    startGapFor(isl) {
      return (isl.blizzard.startGapSec || this.balance.blizzard.startGapSec) * this.blizzardBase(isl);
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
        p.s = Math.max(along * P.bonkKeep, speed * P.bonkFloor);
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
          this.blizzardX = Math.max(this.blizzardX - this.balance.blizzard.feverPushSec * this.blizzardBase(), p.x - this.maxGap());
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
      const warm = this.islandsCleared > 0 ? 1 : 0.65 + 0.35 * Math.min(1, this.islandTime / B.warmup);
      let v = (isl.blizzard.speed * warm + isl.blizzard.accel * this.islandTime) * (1 - this.assist);
      if (this.modifiers.blizzardMul) v *= this.modifiers.blizzardMul;
      const maxGap = this.maxGap();
      if (gap > maxGap) v += (gap - maxGap) * B.rubberBandMul;
      if (this.blizzardHold > 0) {
        this.blizzardHold -= dt;
        if (gap <= maxGap) v = 0;
      }
      this.blizzardV = v;
      this.blizzardX += v * dt;
      const g2 = this.gap;
      if (g2 < this.stats.minGap) this.stats.minGap = g2;
      const dg = this.dangerGap();
      const danger = g2 < dg;
      if (danger && !this._wasDanger) this.emit("danger");
      if (!danger && this._wasDanger && g2 > dg * 1.4) {
        this.stats.closeCalls++;
        this.emit("escape");
        this._wasDanger = false;
      }
      if (danger) this._wasDanger = true;
      if (g2 <= 0) {
        if (this.scarfCharges > 0) {
          this.scarfCharges--;
          this.stats.secondWinds++;
          this.blizzardX = this.p.x - this.scarfPush * this.blizzardBase() / 1e3;
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
        this.blizzardX = p.x - this.startGapFor(next);
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
    const plus = {};
    for (const k of ["flap", "slide", "magnet", "glide", "scarf"]) plus[k] = Math.min(balance.upgrades[k].maxLevel, (ups[k] || 0) + 2);
    let pc = 0;
    for (let s = 1; s <= seeds; s++) {
      const sim2 = new RunSim({ levels: levels2.slice(0, index + 1), balance, upgrades: plus, startIndex: index });
      const r2 = playRun(sim2, makeBot("good", s * 53 + index), 400);
      if (r2.islandsCleared > 0 || sim2.p.x >= sim2.island.endX - 5) pc++;
    }
    result.goodPlus2 = pc / seeds;
    const sim = new RunSim({ levels: levels2.slice(0, index + 1), balance, startIndex: index });
    result.fishAvailable = sim.island.fishTotal;
    result.lengthM = Math.round(sim.island.length / balance.display.unitsPerMeter);
    const P = result.profiles;
    result.pass = (P.expert ? P.expert.clearRate >= 1 : true) && result.goodPlus2 >= 0.6;
    result.notes = [];
    if (P.expert && P.expert.clearRate < 1) result.notes.push("not reliably beatable: expert with expected upgrades fails");
    if (result.goodPlus2 < 0.6) result.notes.push("too hard: good player with +2 upgrade levels clears < 60%");
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
    lv.blizzard = lv.blizzard || { speed: 700, accel: 6 };
    for (const k of ["speed", "accel", "startGapSec"]) el.append(input(k, lv.blizzard[k], (v) => {
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
