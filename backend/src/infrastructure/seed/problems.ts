import { Difficulty } from "../../domain/enums/index.js";
import { Problem } from "../../domain/models/Problem.js";
import { Rubric } from "../../domain/models/Rubric.js";

export const SEED_PROBLEMS: Problem[] = [
  new Problem({
    id: "parking-lot",
    title: "Design a Multi-Level Parking Lot",
    tagline: "Model floors, parking spots, vehicle types, fee calculation, and entry/exit gates.",
    description: `Design an automated parking lot management system capable of managing multiple floors, different vehicle types (Motorcycle, Car, Truck), allocating spots dynamically near entrances, calculating parking fees based on duration and vehicle size, and processing payments upon exit.`,
    difficulty: Difficulty.MEDIUM,
    requirements: [
      "Support multiple levels/floors with designated spots for motorcycles, compact cars, and large trucks.",
      "Issue a parking ticket with timestamp and allocated spot at entry gate.",
      "Support flexible fee calculation strategies (e.g. hourly rate, flat first hour, vehicle-type multiplier).",
      "Process checkout at exit gate, calculate amount due, process payment, and vacate spot.",
      "Provide real-time display boards showing available spots per floor and type.",
      "Safely handle concurrent spot allocation to prevent double-booking."
    ],
    constraints: [
      "System must follow SOLID principles and OOP best practices.",
      "Spot allocation algorithm should be decoupled from the core parking lot entity (Strategy Pattern).",
      "Payment processing should be pluggable (Cash, Card, UPI).",
      "Thread safety / concurrency must be addressed for spot locking."
    ],
    rubric: Rubric.createDefaultRubric(),
    starterTemplate: {
      requirementsAndAssumptions: `Assumptions:
- Single entry gate and single exit gate (extensible to multiple).
- Spot allocation follows nearest-to-entrance strategy.
- Concurrency handled via optimistic/pessimistic locking on spot status.`,
      entitiesAndInterfaces: [
        {
          name: "ParkingLot",
          responsibilities: "Main facade coordinating floors, gates, and global configuration.",
          methods: ["getAvailableSpots(type): number", "processEntry(vehicle): Ticket", "processExit(ticket): Receipt"],
          relationships: ["has many ParkingFloor", "has many EntryGate", "has many ExitGate"]
        },
        {
          name: "ParkingSpot",
          responsibilities: "Represents an individual parking slot with size and occupancy status.",
          fields: ["id: string", "floorNumber: number", "spotType: SpotType", "isOccupied: boolean"],
          methods: ["assignVehicle(vehicle): boolean", "vacate(): void"]
        },
        {
          name: "IParkingStrategy",
          isInterface: true,
          responsibilities: "Strategy interface for finding the optimal spot for incoming vehicle.",
          methods: ["findSpot(floors, vehicleType): ParkingSpot | null"]
        }
      ],
      patternsAndTradeoffs: [
        {
          patternName: "Strategy Pattern",
          whereApplied: "IParkingStrategy and IFeeCalculationStrategy",
          rationale: "Allows hot-swapping parking assignment algorithms (e.g. NearestFirst vs FloorBalanced) without touching ParkingLot class."
        }
      ],
      diagramOrCode: `classDiagram
    ParkingLot "1" *-- "many" ParkingFloor
    ParkingFloor "1" *-- "many" ParkingSpot
    ParkingLot --> IParkingStrategy : uses
    ParkingLot --> IFeeCalculationStrategy : uses`
    },
    sampleSolution: {
      requirementsAndAssumptions: `Scope & Assumptions:
1. Multi-level facility with motorcycle, compact, and large truck bays.
2. Multiple entry and exit terminals operating concurrently.
3. Pricing policy can evolve (e.g. peak hours, vehicle multipliers).
4. Concurrency: Multiple entry gates attempting to assign spots simultaneously requires synchronized spot acquisition.`,
      entitiesAndInterfaces: [
        {
          name: "ParkingLot",
          responsibilities: "Singleton facade for the entire facility. Aggregates floors, delegates allocation and payment.",
          methods: ["parkVehicle(Vehicle): Ticket", "checkoutVehicle(Ticket, PaymentMethod): Receipt", "getDisplayStatus(): DisplayBoard"],
          relationships: ["has many ParkingFloor", "uses SpotAssignmentStrategy", "uses FeeCalculator"]
        },
        {
          name: "ParkingFloor",
          responsibilities: "Maintains list of spots and updates per-floor capacity counters.",
          fields: ["floorNumber: number", "spots: Map<SpotType, ParkingSpot[]>"],
          methods: ["getVacantSpots(SpotType): ParkingSpot[]", "isFull(): boolean"]
        },
        {
          name: "ParkingSpot",
          responsibilities: "Encapsulates spot state, type compatibility, and atomic lock/unlock.",
          fields: ["spotId: string", "type: SpotType", "isOccupied: boolean", "currentVehicle: Vehicle"],
          methods: ["isFitFor(Vehicle): boolean", "occupy(Vehicle): void", "release(): void"]
        },
        {
          name: "SpotAssignmentStrategy",
          isInterface: true,
          responsibilities: "Abstracts the parking slot selection policy.",
          methods: ["findSpot(floors: ParkingFloor[], vehicle: Vehicle): ParkingSpot | null"]
        },
        {
          name: "NearestEntranceStrategy",
          responsibilities: "Concrete strategy choosing lowest floor and spot index closest to entrance.",
          relationships: ["implements SpotAssignmentStrategy"]
        },
        {
          name: "FeeCalculator",
          responsibilities: "Calculates total dues based on ticket duration and applied rate card.",
          methods: ["calculateFee(ticket: Ticket, pricingStrategy: PricingStrategy): number"]
        },
        {
          name: "PaymentProcessor",
          isInterface: true,
          responsibilities: "Decouples transaction processing from exit gate logic.",
          methods: ["pay(amount: number, details: PaymentDetails): boolean"]
        },
        {
          name: "Ticket",
          responsibilities: "Value object recording entry timestamp, spot id, vehicle license, and status.",
          fields: ["ticketId: string", "entryTime: Date", "spotId: string", "licensePlate: string"]
        }
      ],
      patternsAndTradeoffs: [
        {
          patternName: "Strategy Pattern",
          whereApplied: "SpotAssignmentStrategy and PricingStrategy",
          rationale: "Separates volatile business algorithms (e.g., dynamic pricing, VIP allocation) from the core structural entities."
        },
        {
          patternName: "Factory Pattern",
          whereApplied: "VehicleFactory & PaymentProcessorFactory",
          rationale: "Encapsulates instantiation of polymorphic vehicles and payment handlers based on config."
        },
        {
          patternName: "Observer Pattern",
          whereApplied: "DisplayBoard observing Floor occupancy events",
          rationale: "Ensures signage displays remain real-time without polling or tight coupling between spots and boards."
        }
      ],
      diagramOrCode: `classDiagram
    class ParkingLot {
        -floors: List~ParkingFloor~
        -spotStrategy: SpotAssignmentStrategy
        -feeCalculator: FeeCalculator
        +parkVehicle(Vehicle): Ticket
        +checkoutVehicle(Ticket, PaymentMethod): Receipt
    }
    class ParkingFloor {
        -floorNumber: int
        -spots: List~ParkingSpot~
    }
    class ParkingSpot {
        -spotId: string
        -type: SpotType
        -isOccupied: boolean
        +occupy(Vehicle)
        +release()
    }
    class SpotAssignmentStrategy {
        <<interface>>
        +findSpot(List~ParkingFloor~, Vehicle): ParkingSpot
    }
    class FeeCalculator {
        +calculateFee(Ticket, PricingStrategy): double
    }
    ParkingLot *-- ParkingFloor
    ParkingFloor *-- ParkingSpot
    ParkingLot --> SpotAssignmentStrategy
    ParkingLot --> FeeCalculator`
    }
  }),

  new Problem({
    id: "elevator-system",
    title: "Design an Elevator Control System",
    tagline: "Orchestrate elevator cars, internal/external buttons, dispatch algorithms, and safety rules.",
    description: `Design a scalable elevator system controlling a bank of elevators in a high-rise building. The system must process hall calls (up/down requests from floors) and car calls (floor buttons pressed inside an elevator), optimize scheduling using dispatch algorithms (e.g. SCAN / LOOK), handle door operations, and enforce safety/overload conditions.`,
    difficulty: Difficulty.HARD,
    requirements: [
      "Manage multiple elevator cars operating concurrently across N floors.",
      "Handle external hall calls (floor number + desired direction: UP/DOWN).",
      "Handle internal destination car calls made by passengers inside a specific car.",
      "Dispatch the most suitable elevator car using an extensible scheduling algorithm.",
      "Model elevator states: MOVING_UP, MOVING_DOWN, IDLE, DOOR_OPEN, MAINTENANCE.",
      "Support weight limit detection (overload warning) and emergency stop overrides."
    ],
    constraints: [
      "Dispatch algorithm should be swappable (e.g. FCFS, SSTF, SCAN/LOOK) without modifying ElevatorCar.",
      "Clear separation of concerns between physical elevator mechanics, passenger UI, and central dispatcher.",
      "Handle edge cases: idle car balancing, requests in opposite direction, and multiple requests on same floor."
    ],
    rubric: Rubric.createDefaultRubric(),
    starterTemplate: {
      requirementsAndAssumptions: `Assumptions:
- Bank of 4 elevators servicing 20 floors.
- Peak hours may favor ground-floor return.
- LOOK algorithm (elevator continues in current direction until no further calls exist).`,
      entitiesAndInterfaces: [
        {
          name: "ElevatorController",
          responsibilities: "Central coordinator managing elevator bank and external call dispatching.",
          methods: ["handleHallCall(floor, direction): void", "handleCarCall(carId, targetFloor): void", "step(): void"]
        },
        {
          name: "ElevatorCar",
          responsibilities: "Encapsulates physical elevator state, door controller, and internal request queue.",
          fields: ["id: number", "currentFloor: number", "state: ElevatorState", "door: Door"],
          methods: ["moveTo(targetFloor): void", "openDoor(): void", "closeDoor(): void"]
        },
        {
          name: "IDispatchStrategy",
          isInterface: true,
          responsibilities: "Evaluates best elevator car to assign to a given hall request.",
          methods: ["selectCar(cars: ElevatorCar[], request: HallCall): ElevatorCar"]
        }
      ],
      patternsAndTradeoffs: [
        {
          patternName: "State Pattern",
          whereApplied: "ElevatorState (IdleState, MovingUpState, MovingDownState, DoorOpenState)",
          rationale: "Prevents messy switch/case blocks for valid transitions (e.g., cannot move while doors open)."
        }
      ]
    },
    sampleSolution: {
      requirementsAndAssumptions: `Scope & Assumptions:
1. Elevator bank with M cars across N floors.
2. External requests (Hall Calls) are handled by a central Dispatcher.
3. Internal floor requests (Car Calls) are queued directly within the assigned car.
4. Optimization metric: minimize passenger wait time and energy consumption using LOOK algorithm.`,
      entitiesAndInterfaces: [
        {
          name: "ElevatorBankDispatcher",
          responsibilities: "Coordinates all cars, registers external hall calls, and assigns calls via DispatchStrategy.",
          methods: ["submitHallRequest(HallRequest): void", "registerCarRequest(carId, floor): void"],
          relationships: ["has many ElevatorCar", "uses IDispatchStrategy"]
        },
        {
          name: "ElevatorCar",
          responsibilities: "Maintains current position, direction, motion engine, and internal floor destination queues.",
          fields: ["carId: int", "currentFloor: int", "direction: Direction", "state: ElevatorState", "upQueue: TreeSet", "downQueue: TreeSet"],
          methods: ["addDestination(floor): void", "processNextStep(): void", "isAvailable(): boolean"]
        },
        {
          name: "IDispatchStrategy",
          isInterface: true,
          responsibilities: "Pluggable algorithm deciding which car services an incoming hall call.",
          methods: ["chooseBestCar(cars: ElevatorCar[], request: HallRequest): ElevatorCar"]
        },
        {
          name: "LookDispatchStrategy",
          responsibilities: "Calculates cost based on car proximity, current direction, and remaining stops using the LOOK algorithm.",
          relationships: ["implements IDispatchStrategy"]
        },
        {
          name: "DoorController",
          responsibilities: "Manages door open/close timers, obstruction sensors, and emergency interlocks.",
          methods: ["open(): void", "close(): boolean", "isObstructed(): boolean"]
        },
        {
          name: "WeightSensor",
          responsibilities: "Monitors cabin weight against maximum certified payload.",
          methods: ["isOverloaded(): boolean", "getCurrentWeight(): number"]
        }
      ],
      patternsAndTradeoffs: [
        {
          patternName: "State Pattern",
          whereApplied: "ElevatorState (MovingState, IdleState, StoppedState, MaintenanceState)",
          rationale: "Guarantees valid transitions (e.g., doors cannot open when in MovingState, car cannot move when Overloaded)."
        },
        {
          patternName: "Strategy Pattern",
          whereApplied: "IDispatchStrategy",
          rationale: "Enables switching dispatch algorithms (e.g. SCAN vs Destination Dispatch vs Zone Based) without altering ElevatorCar logic."
        },
        {
          patternName: "Command Pattern",
          whereApplied: "HallRequest and DestinationRequest",
          rationale: "Encapsulates button press actions into executable, queueable command objects."
        }
      ],
      diagramOrCode: `classDiagram
    ElevatorBankDispatcher "1" *-- "many" ElevatorCar
    ElevatorBankDispatcher --> IDispatchStrategy : uses
    ElevatorCar *-- DoorController
    ElevatorCar *-- WeightSensor
    ElevatorCar --> ElevatorState : holds
    LookDispatchStrategy ..|> IDispatchStrategy`
    }
  }),

  new Problem({
    id: "vending-machine",
    title: "Design an Automated Vending Machine",
    tagline: "Handle states, inventory, currency acceptance, change return, and item dispensing.",
    description: `Design the software for a modern snack and drink vending machine. The system must maintain product inventory across slots, accept coins/notes, validate inserted denominations, handle cancellations and refunds, dispense selected items, and calculate exact change.`,
    difficulty: Difficulty.EASY,
    requirements: [
      "Maintain a catalog of products with codes, prices, and quantities per rack/slot.",
      "Accept money in supported denominations (e.g. 1, 5, 10, 20 currency units).",
      "Allow user to select an item code, verify sufficient balance and stock.",
      "Dispense item, update inventory, and return remaining change in optimal denominations.",
      "Support transaction cancellation at any point before dispensing, refunding full inserted amount.",
      "Handle edge cases: insufficient balance, sold out item, and machine out of change."
    ],
    constraints: [
      "Must implement the State Design Pattern to model machine states and guard invalid actions.",
      "Clear separation between inventory, cash register, and customer display.",
      "Thread safety for concurrent purchases if operated via digital/network interface."
    ],
    rubric: Rubric.createDefaultRubric(),
    starterTemplate: {
      requirementsAndAssumptions: `Assumptions:
- Cash-based machine accepting coins and bills.
- Inventory is organized by shelf slot code (e.g., A1, B2).
- Greedy coin change algorithm assuming standard currency denominations.`,
      entitiesAndInterfaces: [
        {
          name: "VendingMachine",
          responsibilities: "Coordinates user interactions, holds current state, inventory, and cash register.",
          methods: ["insertCoin(coin): void", "selectItem(code): void", "dispenseItem(): Item", "cancel(): Refund"]
        },
        {
          name: "IVendingState",
          isInterface: true,
          responsibilities: "State interface declaring valid user and internal actions.",
          methods: ["insertMoney(amount): void", "selectProduct(code): void", "dispense(): void", "refund(): void"]
        },
        {
          name: "Inventory",
          responsibilities: "Tracks shelf slots, product quantities, and stock depletion.",
          methods: ["isAvailable(code): boolean", "decrement(code): void", "restock(code, count): void"]
        }
      ],
      patternsAndTradeoffs: [
        {
          patternName: "State Pattern",
          whereApplied: "IVendingState (IdleState, HasMoneyState, DispensingState, SoldOutState)",
          rationale: "Prevents illegal operations (e.g. pressing refund while dispensing, or selecting item with 0 balance)."
        }
      ]
    },
    sampleSolution: {
      requirementsAndAssumptions: `Scope & Assumptions:
1. Products arranged by aisle code with individual pricing and quantity.
2. Supports Cash / Coin register and returns optimal change.
3. System must be resilient to user cancellations and out-of-stock scenarios.
4. State pattern strictly enforces that each operational step only happens in appropriate state.`,
      entitiesAndInterfaces: [
        {
          name: "VendingMachineContext",
          responsibilities: "Main state context. Delegates user actions to current state object and holds references to Inventory and CashRegister.",
          methods: ["insertMoney(Denomination): void", "pressProductButton(code): void", "requestRefund(): List~Coin~", "setState(VendingState): void"],
          relationships: ["has one Inventory", "has one CashRegister", "holds current VendingState"]
        },
        {
          name: "IVendingState",
          isInterface: true,
          responsibilities: "State contract specifying behavior for all machine phases.",
          methods: ["insertMoney(ctx, amount): void", "selectProduct(ctx, code): void", "dispense(ctx): void", "refund(ctx): List~Coin~"]
        },
        {
          name: "IdleState",
          responsibilities: "Machine waiting for customer interaction. Only money insertion is valid.",
          relationships: ["implements IVendingState"]
        },
        {
          name: "HasMoneyState",
          responsibilities: "Money inserted; allows adding more money, selecting an item, or refunding.",
          relationships: ["implements IVendingState"]
        },
        {
          name: "DispensingState",
          responsibilities: "Dispenses product, calculates change, and transitions back to IdleState.",
          relationships: ["implements IVendingState"]
        },
        {
          name: "Inventory",
          responsibilities: "Thread-safe map of Slot to Product items.",
          fields: ["slots: Map<string, InventorySlot>"],
          methods: ["getProduct(code): Product", "hasStock(code): boolean", "deduct(code): void"]
        },
        {
          name: "CashRegister",
          responsibilities: "Maintains count of each denomination, computes change, and returns refund.",
          methods: ["add(Denomination): void", "calculateChange(amount): List~Denomination~"]
        }
      ],
      patternsAndTradeoffs: [
        {
          patternName: "State Pattern",
          whereApplied: "IVendingState and concrete states (IdleState, HasMoneyState, DispensingState)",
          rationale: "Cleanly isolates behavior for each state and eliminates nested if-else ladders across user inputs."
        },
        {
          patternName: "Strategy Pattern",
          whereApplied: "IChangeDispenseStrategy (Greedy vs Dynamic Programming change return)",
          rationale: "Decouples change-making logic from the physical coin dispenser."
        }
      ],
      diagramOrCode: `classDiagram
    class VendingMachineContext {
        -state: IVendingState
        -inventory: Inventory
        -cashRegister: CashRegister
        +insertMoney(amount)
        +selectProduct(code)
        +dispense()
        +refund()
    }
    class IVendingState {
        <<interface>>
        +insertMoney()
        +selectProduct()
        +dispense()
        +refund()
    }
    VendingMachineContext *-- IVendingState
    VendingMachineContext *-- Inventory
    VendingMachineContext *-- CashRegister
    IdleState ..|> IVendingState
    HasMoneyState ..|> IVendingState
    DispensingState ..|> IVendingState`
    }
  })
];
