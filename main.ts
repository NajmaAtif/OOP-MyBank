#! /usr/bin/env node

import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
import { CLIENT_RENEG_LIMIT } from "tls";




// customer class
class Customer {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  mobNumber: number;
  accNumber: number;

  constructor(
    fname: string,
    lname: string,
    age: number,
    gender: string,
    mob: number,
    acc: number
  ) {
    this.firstName = fname;
    this.lastName = lname;
    this.age = age;
    this.gender = gender;
    this.mobNumber = mob;
    this.accNumber = acc;
  }
}

// interface BankAccount
interface BankAccount{
    accNumber:number,
    balance :number,
}

// class Bank
class Bank {
    customer : Customer[]=[]
    account:BankAccount[]=[]

    addCustomer(obj:Customer){
        this.customer.push(obj);
    }

    addAccountNumber(obj:BankAccount) {
      this.account.push(obj);

    }
    transaction(accObj:BankAccount){
      let newAccounts = this.account.filter(acc => acc.accNumber !== accObj.accNumber);
      this.account = [...newAccounts,accObj];

    }
}


let myBank =  new Bank ();

// customer create
for (let i:number = 1; i<=3;i++){
    let fName = faker.person.firstName(`male`)
    let lName = faker.person.lastName()
    let num = parseInt(faker.phone.number("3#########"));
    const cus = new Customer(fName,lName,25*i,"male",num,1000+i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({accNumber:cus.accNumber,balance:100 * i});

}
// console.log(myBank)

// Bank Functionality

async function bankService(bank:Bank) {
 do{   let service = await inquirer.prompt({
  type: "list",
  name: "Select",
  message: "Please select the service",
  choices: [
    {name:"View Balance",value:"View Balance"},
    {name:"Cash Withdraw",value:"Cash Withdraw"},
    {name:"Cash Deposit",value:"Cash Deposit"},
    {name:"Exit",value:"Exit"}
  ]
})


//  View Balance
if (service.Select == "View Balance"){
  let res = await inquirer.prompt({
    type: "input",
    name: "num",
    message: "Please Enter Your Account Number:",
});
let account = myBank.account.find((acc)=>acc.accNumber == res.num)
if (!account){
  console.log(chalk.red.bold.italic("Invalid Account Number"))
}
if(account){
  let name= myBank.customer.find((item)=>item.accNumber==account?.accNumber)
  console.log(
 `Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.
  italic(name?.lastName)} your account balance is ${chalk.bold.blueBright(`$${account.balance}`)}`)
}

}

// Cash withdraw
if (service.Select == "Cash Withdraw"){
  let res = await inquirer.prompt({
    type: "input",
    name: "num",
    message: "Please Enter Your Account Number:",

});
let account = myBank.account.find((acc)=>acc.accNumber == res.num);
if (!account){
  console.log(chalk.red.bold.italic("Invalid Account Number"))
}
if(account){
  let ans = await inquirer.prompt({
    type:"number",
    message:"Please Enter Your Amount:",
    name:"rupee",
  });
  if(ans.rupee > account.balance){
    console.log(chalk.bold.red("Insufficient Balance!"))
  }
  let newBalance = account.balance-ans.rupee;
  // transaction method call
  bank.transaction({accNumber:account.accNumber,balance:newBalance});
  
}
}

// Cash Deposit
if (service.Select == "Cash Deposit"){
    let res = await inquirer.prompt({
      type: "input",
      name: "num",
      message: "Please Enter Your Account Number:",

  });
  let account = myBank.account.find((acc)=>acc.accNumber == res.num);
  if (!account){
    console.log(chalk.red.bold.italic("Invalid Account Number"))
  }
  if(account){
    let ans = await inquirer.prompt({
      type:"number",
      message:"Please Enter Your Amount:",
      name:"rupee",
    });
    let newBalance = account.balance+ans.rupee;
    // transaction method call
    bank.transaction({accNumber:account.accNumber,balance:newBalance});
    
  }
}
if(service.Select == "Exit"){
  return;
}
}
 while(true)

    }
  

bankService(myBank);