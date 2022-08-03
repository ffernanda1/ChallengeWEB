var dates= new Date(2022,05, 16, 11, 05);
db.challenge({yourDateFieldName:yourVariableName});

db.challenge.insertOne(
    { _id: "d10",
    strings: "nanda",
    integers: 10,
    floats: 5.10,
    tanggal: dates,
    booleans: false }
);

db.challenge.insertOne(
    { _id: "d11",
    strings: "nand0",
    integers: 11,
    floats: 5.15,
    tanggal: new Date(2022,06,12,05,02),
    booleans: false }
);