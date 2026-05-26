/* ==========================================
   STUDY STREAK BATTLE - RPG ENGINE (PURE LOCAL STORAGE)
   ========================================== */

let currentUser = null;
let virtualTimeOffset = 0;

// --- B.TECH 1ST YEAR MCQS DATABASE ---
const SUBJECT_QUESTIONS = {
  "Engineering Physics": [
    {
      q: "In Newton's rings experiment, why is the central spot in reflected light always dark?",
      o: ["Due to constructive interference", "Due to destructive interference caused by a phase change of pi on reflection", "Because the glass plate absorbs all light", "Because thickness is infinite"],
      a: 1
    },
    {
      q: "The phenomenon of division of amplitude is observed in which of the following experiments?",
      o: ["Fresnel's biprism", "Newton's rings", "Fraunhofer diffraction", "Michelson stellar interferometer"],
      a: 1
    },
    {
      q: "Laser action is based on which of the following physics concepts?",
      o: ["Spontaneous emission only", "Stimulated emission of radiation", "Photoelectric absorption", "Compton scattering"],
      a: 1
    },
    {
      q: "Which doped active medium is used in a Ruby laser system?",
      o: ["Al2O3 doped with Cr3+ ions", "He-Ne gas mixture", "GaAs semiconductor", "CO2 gas with Nitrogen"],
      a: 0
    },
    {
      q: "To achieve total internal reflection in an optical fiber, the refractive index of the cladding must be:",
      o: ["Higher than the core", "Equal to the core", "Lower than the core", "Dependent on fiber length"],
      a: 2
    },
    {
      q: "The photoelectric effect provides conclusive proof that light exhibits:",
      o: ["Pure wave nature", "Particle-like discrete packet nature", "Longitudinal vibration", "No momentum"],
      a: 1
    },
    {
      q: "Who formulated the Uncertainty Principle stating that position and momentum cannot be measured simultaneously?",
      o: ["Erwin Schrodinger", "Werner Heisenberg", "Albert Einstein", "Max Planck"],
      a: 1
    },
    {
      q: "In a semiconductor, the Hall coefficient (R_h) is found to be negative for:",
      o: ["p-type semiconductors", "n-type semiconductors", "Pure intrinsic semiconductors", "Insulators"],
      a: 1
    },
    {
      q: "According to Maxwell's equations, displacement current arises from which of these?",
      o: ["A constant electric field", "A changing magnetic flux", "A time-varying electric field", "A static magnetic pole"],
      a: 2
    },
    {
      q: "The de Broglie hypothesis proposes that the wave nature of a particle has a wavelength equal to:",
      o: ["h / p (Planck's constant / momentum)", "p / h", "h * p", "m * c^2"],
      a: 0
    },
    {
      q: "What does the square of the wave function |Ψ|^2 represent in quantum mechanics?",
      o: ["Charge density", "Probability density of finding the particle", "Exact momentum of the particle", "Velocity vector"],
      a: 1
    },
    {
      q: "The allowed energy levels of a particle confined in a 1D box of length L are proportional to:",
      o: ["L", "L^2", "1 / L", "1 / L^2"],
      a: 3
    },
    {
      q: "Which of the following waves cannot be polarized under any circumstances?",
      o: ["Radio waves", "Light waves", "Sound waves (longitudinal)", "X-Rays"],
      a: 2
    },
    {
      q: "In a thin wedge-shaped film, the interference fringes produced are:",
      o: ["Perfect circles", "Straight lines parallel to the edge of the wedge", "Hyperbolic curves", "Parabolic tracks"],
      a: 1
    },
    {
      q: "What is the SI unit of magnetic field strength H?",
      o: ["Tesla", "Ampere per meter (A/m)", "Weber", "Gauss"],
      a: 1
    }
  ],
  "Engineering Chemistry": [
    {
      q: "The hardness of natural water is primarily caused by the presence of salts of which ions?",
      o: ["Sodium & Potassium", "Calcium & Magnesium", "Iron & Copper", "Ammonium & Nitrate"],
      a: 1
    },
    {
      q: "Clark's process of temporary water softening involves the addition of which chemical?",
      o: ["Sodium carbonate (Soda ash)", "Calcium hydroxide (Slaked lime)", "Zeolite matrix", "Hydrochloric acid"],
      a: 1
    },
    {
      q: "The mathematical formula for the de Broglie wavelength is written as:",
      o: ["lambda = h / (m * v)", "lambda = (m * v) / h", "lambda = h * m * v", "lambda = m / (h * v)"],
      a: 0
    },
    {
      q: "The Nernst equation is used to calculate cell potential based on which variable?",
      o: ["Temperature only", "Pressure of surroundings", "Active concentration of ions", "Atmospheric humidity"],
      a: 2
    },
    {
      q: "The chemical process of vulcanization of raw rubber involves heating it with which additive?",
      o: ["Carbon black", "Sulfur", "Silica gel", "Polyurethane resin"],
      a: 1
    },
    {
      q: "Which polymer is commonly used as a coating for non-stick cookware?",
      o: ["PVC (Polyvinyl Chloride)", "Teflon (PTFE)", "PMMA (Plexiglass)", "Polystyrene"],
      a: 1
    },
    {
      q: "Which gas is the major combustible constituent of Biogas?",
      o: ["Carbon monoxide", "Methane", "Hydrogen", "Butane"],
      a: 1
    },
    {
      q: "A Bomb calorimeter is a laboratory apparatus used specifically to measure:",
      o: ["Viscosity of lubricants", "Calorific value of solid and liquid fuels", "Specific gravity", "Flash point"],
      a: 1
    },
    {
      q: "In Nuclear Magnetic Resonance (NMR) spectroscopy, which reference compound is standard?",
      o: ["Ethanol", "Trichloromethane", "Tetramethylsilane (TMS)", "Benzene ring"],
      a: 2
    },
    {
      q: "Chemically, the common pharmaceutical drug Aspirin is known as:",
      o: ["Acetylsalicylic acid", "Methyl salicylate", "Salicylic acid", "Paracetamol"],
      a: 0
    },
    {
      q: "What is the monomer structure of PVC (Polyvinyl Chloride)?",
      o: ["Ethylene gas", "Vinyl chloride", "Tetrafluoroethylene", "Styrene"],
      a: 1
    },
    {
      q: "Bicarbonate salts of calcium and magnesium in water produce:",
      o: ["Permanent hardness", "Temporary hardness", "Heavy water", "Saline water"],
      a: 1
    },
    {
      q: "Galvanization is a technique used to protect iron from corrosion by coating it with:",
      o: ["Copper metal", "Zinc layer", "Tin coating", "Nickel shell"],
      a: 1
    },
    {
      q: "The molecular structures and magnetic properties of diatomic molecules like O2 are best explained by:",
      o: ["VSEPR theory", "Molecular Orbital Theory (MOT)", "Crystal Field Theory", "Valence Bond Theory"],
      a: 1
    },
    {
      q: "Viscosity Index (VI) is a standard scale that measures a lubricant's:",
      o: ["Total acid value", "Resistance to flow changes with temperature fluctuations", "Flash temperature", "Pour point stability"],
      a: 1
    }
  ],
  "Programming for Problem Solving": [
    {
      q: "Which of the following is the correct printf format specifier for a double variable in C?",
      o: ["%d", "%f", "%lf", "%c"],
      a: 2
    },
    {
      q: "What is the standard memory size of an 'int' data type in 32-bit compilers?",
      o: ["1 byte", "2 bytes", "4 bytes", "8 bytes"],
      a: 2
    },
    {
      q: "Which sorting algorithm has a worst-case complexity of O(N^2) but average O(N log N)?",
      o: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
      a: 1
    },
    {
      q: "What does the C function 'malloc' return if it fails to allocate the requested block?",
      o: ["0 integer", "NULL pointer", "-1 status", "Void pointer"],
      a: 1
    },
    {
      q: "Which operator is used to retrieve the memory address of an active variable in C?",
      o: ["Dereference operator (*)", "Address-of operator (&)", "Logical AND (&&)", "Member selector (->)"],
      a: 1
    },
    {
      q: "What is the index position of the first element in any standard C array?",
      o: ["1", "0", "-1", "User-specified"],
      a: 1
    },
    {
      q: "Which keyword is utilized to define a variable whose value cannot be altered during execution?",
      o: ["static", "volatile", "const", "extern"],
      a: 2
    },
    {
      q: "Which standard C library function is used to return dynamically allocated memory to the system heap?",
      o: ["delete()", "remove()", "free()", "deallocate()"],
      a: 2
    },
    {
      q: "What is the correct syntax to declare a pointer to a primitive integer?",
      o: ["int &p;", "int *p;", "*int p;", "int p*;"],
      a: 1
    },
    {
      q: "Which standard C library header is required to use 'strcmp' or 'strlen'?",
      o: ["<stdio.h>", "<stdlib.h>", "<string.h>", "<math.h>"],
      a: 2
    },
    {
      q: "What is the default value of an uninitialized local variable declared inside a C function?",
      o: ["Zero (0)", "NULL", "Garbage/undefined value", "Compiler warning"],
      a: 2
    },
    {
      q: "Which member access operator is used to access structure members through a structure pointer?",
      o: ["Dot operator (.)", "Arrow operator (->)", "Address operator (&)", "Asterisk (*)"],
      a: 1
    },
    {
      q: "What does the C unary operator 'sizeof' evaluate to?",
      o: ["Total bits occupied", "Total bytes occupied in memory", "Number of array index cells", "Memory offset address"],
      a: 1
    },
    {
      q: "Which loop construct in C is guaranteed to execute its block at least once?",
      o: ["for loop", "while loop", "do-while loop", "infinite loop"],
      a: 2
    },
    {
      q: "In standard C string representations, what is the character used to mark string termination?",
      o: ["New line ('\\n')", "Horizontal tab ('\\t')", "Null terminator ('\\0')", "Whitespace ('\\s')"],
      a: 2
    }
  ],
  "Basic Electronics Engineering": [
    {
      q: "The forbidden energy gap in Silicon at room temperature is approximately:",
      o: ["0.7 eV", "1.1 eV", "1.4 eV", "0.3 eV"],
      a: 1
    },
    {
      q: "A Zener diode is specifically designed to operate in which region of its characteristics?",
      o: ["Forward biased region", "Reverse breakdown region", "Saturation threshold", "Cutoff bias"],
      a: 1
    },
    {
      q: "The theoretical ripple factor of an ideal full-wave rectifier is:",
      o: ["1.21", "0.48", "0.812", "1.11"],
      a: 1
    },
    {
      q: "In a Bipolar Junction Transistor (BJT), which region is doped most heavily?",
      o: ["Emitter", "Base", "Collector", "Base-Collector barrier"],
      a: 0
    },
    {
      q: "A Junction Field Effect Transistor (JFET) is fundamentally categorized as a:",
      o: ["Current-controlled device", "Voltage-controlled device", "Charge-induced resistor", "Frequency selector"],
      a: 1
    },
    {
      q: "A Karnaugh Map (K-map) representing 4 active logic variables contains how many cell squares?",
      o: ["8 cells", "16 cells", "32 cells", "64 cells"],
      a: 1
    },
    {
      q: "An ideal operational amplifier (Op-Amp) has an input impedance of:",
      o: ["Zero ohms", "100 ohms", "1 Megaohm", "Infinite ohms"],
      a: 3
    },
    {
      q: "Which of the following logic gates is classified as a universal gate?",
      o: ["AND gate", "OR gate", "NAND gate", "XOR gate"],
      a: 2
    },
    {
      q: "In an inverting op-amp configuration, if input voltage is 1V and gain is -5, output voltage is:",
      o: ["1V", "-5V", "5V", "-0.2V"],
      a: 1
    },
    {
      q: "The depletion layer of a typical p-n junction diode contains which of these?",
      o: ["Free flowing electrons", "Free flowing holes", "Immobile positive and negative ions", "Neutral gas atoms"],
      a: 2
    },
    {
      q: "The decimal equivalent of the binary representation (1010)_2 is:",
      o: ["8", "10", "12", "14"],
      a: 1
    },
    {
      q: "In a MOSFET, the conductive gate is electrically insulated from the channel by a layer of:",
      o: ["Silicon Dioxide (SiO2)", "Silicon Nitride", "Poly-silicon crystal", "Gallium Arsenide"],
      a: 0
    },
    {
      q: "The voltage gain of a standard unity follower (buffer) op-amp circuit is:",
      o: ["Zero (0)", "One (1)", "Infinite", "Negative one (-1)"],
      a: 1
    },
    {
      q: "Which logic gate yields a HIGH (1) output ONLY when all its inputs are LOW (0)?",
      o: ["AND gate", "OR gate", "NAND gate", "NOR gate"],
      a: 3
    },
    {
      q: "The thermal voltage V_t at standard room temperature is approximately equal to:",
      o: ["26 mV", "0.7 V", "1.5 V", "50 mV"],
      a: 0
    }
  ],
  "Basic Electrical Engineering": [
    {
      q: "The Superposition Theorem is mathematically applicable only to networks that are:",
      o: ["Linear and bilateral", "Non-linear and bilateral", "Magnetic coupling coils", "Time-varying parametric"],
      a: 0
    },
    {
      q: "Kirchhoff's Current Law (KCL) at a node is a direct statement of conservation of:",
      o: ["Energy", "Mass", "Electric Charge", "Momentum"],
      a: 2
    },
    {
      q: "The power factor of a purely capacitive AC circuit is equal to:",
      o: ["Unity (1)", "Zero leading", "Zero lagging", "0.707 leading"],
      a: 1
    },
    {
      q: "In an AC electrical circuit, the ratio of real power (W) to apparent power (VA) is defined as:",
      o: ["Quality factor", "Power factor", "Form factor", "Resonant coefficient"],
      a: 1
    },
    {
      q: "An electrical power transformer operates based on the physical principle of:",
      o: ["Self induction only", "Mutual electromagnetic induction", "Peltier thermal effect", "Variable conductance"],
      a: 1
    },
    {
      q: "In a practical transformer, the constant iron losses (core losses) consist of:",
      o: ["Copper heating and Hysteresis", "Hysteresis and Eddy current losses", "Frictional drag and windage", "Dielectric leakages"],
      a: 1
    },
    {
      q: "A Miniature Circuit Breaker (MCB) protects a domestic installation from:",
      o: ["Under-voltage drops", "Overload currents and Short-circuit faults", "Phase angle shift", "Grid frequency drift"],
      a: 1
    },
    {
      q: "What is the equivalent resistance of two 10-ohm resistors connected in parallel?",
      o: ["20 ohms", "5 ohms", "10 ohms", "2.5 ohms"],
      a: 1
    },
    {
      q: "The synchronous speed of a 4-pole induction motor connected to a 50Hz AC supply is:",
      o: ["3000 rpm", "1500 rpm", "1000 rpm", "750 rpm"],
      a: 1
    },
    {
      q: "A standard rechargeable lead-acid battery is classified as a:",
      o: ["Primary cell", "Secondary cell", "Fuel cell", "Solar storage capacitor"],
      a: 1
    },
    {
      q: "What is the standard unit of reactive power in electrical engineering?",
      o: ["Watt (W)", "Volt-Ampere (VA)", "Volt-Ampere Reactive (VAR)", "Joule (J)"],
      a: 2
    },
    {
      q: "A Norton equivalent circuit represents a network as which of these?",
      o: ["Voltage source in series with resistor", "Current source in parallel with resistor", "Voltage source in parallel with resistor", "Current source in series with resistor"],
      a: 1
    },
    {
      q: "At resonant frequency in a series RLC AC circuit, the total impedance is:",
      o: ["Maximum value", "Minimum value and purely resistive", "Zero", "Infinite"],
      a: 1
    },
    {
      q: "Which meter instrument is installed to measure domestic electrical energy consumption?",
      o: ["Wattmeter", "Energy meter (kilowatt-hour meter)", "Voltmeter", "Multimeter"],
      a: 1
    },
    {
      q: "The primary winding coils of a step-down voltage transformer are connected to:",
      o: ["The load machine", "The incoming supply voltage source", "The protective earth", "The secondary coils directly"],
      a: 1
    }
  ],
  "Basic Mechanical Engineering": [
    {
      q: "The Zeroth Law of Thermodynamics establishes the physical definition of:",
      o: ["Internal Energy", "Entropy", "Temperature (thermal equilibrium)", "External Work"],
      a: 2
    },
    {
      q: "A Carnot heat engine operates between temperatures 600K and 300K. Its efficiency is:",
      o: ["100%", "50%", "25%", "33.3%"],
      a: 1
    },
    {
      q: "The First Law of Thermodynamics is a fundamental statement of: ",
      o: ["Conservation of mass", "Conservation of energy", "Direction of heat transfer", "Entropy increase direction"],
      a: 1
    },
    {
      q: "A standard four-stroke IC engine completes one full working cycle in how many crankshaft revolutions?",
      o: ["1 revolution", "2 revolutions", "4 revolutions", "0.5 revolutions"],
      a: 1
    },
    {
      q: "In an ideal Diesel cycle, the fuel combustion/heat addition process takes place at constant:",
      o: ["Volume", "Pressure", "Temperature", "Entropy"],
      a: 1
    },
    {
      q: "Newton's Law of Viscosity states that shear stress in a fluid is directly proportional to:",
      o: ["Pressure gradient", "Velocity gradient (rate of shear strain)", "Temperature gradient", "Fluid density"],
      a: 1
    },
    {
      q: "Hooke's Law states that within a material's elastic limit:",
      o: ["Stress is directly proportional to strain", "Stress is directly proportional to strain", "Stress is independent of strain", "Strain is stress squared"],
      a: 1
    },
    {
      q: "The ratio of transverse lateral strain to longitudinal axial strain under tensile loading is called:",
      o: ["Young's modulus", "Poisson's ratio", "Bulk modulus", "Shear stiffness"],
      a: 1
    },
    {
      q: "The derivation of Bernoulli's fluid equation is based on the principle of conservation of:",
      o: ["Mass", "Momentum", "Total mechanical energy", "Angular momentum"],
      a: 2
    },
    {
      q: "An Otto cycle (used in petrol engines) is also classified as a constant:",
      o: ["Pressure cycle", "Volume cycle", "Temperature cycle", "Entropy cycle"],
      a: 1
    },
    {
      q: "A standard centrifugal water pump raises fluid energy by utilizing:",
      o: ["Reciprocating piston displacement", "Forced vortex rotational flow", "Free vortex suction", "Axial compression"],
      a: 1
    },
    {
      q: "On a stress-strain diagram for mild steel, the point where plastic deformation starts is:",
      o: ["Proportionality limit", "Elastic limit", "Yield point", "Ultimate fracture stress"],
      a: 2
    },
    {
      q: "Under mechanical loading, standard cast iron is structurally classified as a:",
      o: ["Brittle material", "Brittle material", "Highly malleable alloy", "Perfect elastic material"],
      a: 1
    },
    {
      q: "The mechanical unit of stress (Pascal) is identical to the unit of:",
      o: ["Tensile Force", "Total Work done", "Fluid Pressure", "Kinetic Energy"],
      a: 2
    }
  ],
  "Analytical Mathematics": [
    {
      q: "What is the order of the higher-order differential equation (d^2y/dx^2)^3 + (dy/dx)^4 + y = 0?",
      o: ["Order 1", "Order 2", "Order 3", "Order 4"],
      a: 1
    },
    {
      q: "Clairaut's form of a first-order differential equation is mathematically represented by:",
      o: ["y = px + f(p)", "y = p * f(x) + p", "y = x + f(p)", "y^2 = px + f(p)"],
      a: 0
    },
    {
      q: "The necessary and sufficient condition for the differential equation Mdx + Ndy = 0 to be exact is:",
      o: ["dM/dy = dN/dx", "dM/dx = dN/dy", "dM/dy = -dN/dx", "d^2M/dy^2 = d^2N/dx^2"],
      a: 0
    },
    {
      q: "The Fourier series expansion of an even function f(x) in the interval [-pi, pi] contains only which terms?",
      o: ["Sine terms only", "Cosine terms only", "Constant term and Cosine terms", "Exponential imaginary terms"],
      a: 2
    },
    {
      q: "Which convergence test is specifically designed to check the convergence of an alternating series?",
      o: ["D'Alembert's ratio test", "Cauchy's root test", "Leibniz's test", "Raabe's test"],
      a: 2
    },
    {
      q: "If u = x^2 + y^2, then by Euler's theorem for homogeneous functions, what is x*(du/dx) + y*(du/dy)?",
      o: ["u", "2u", "3u", "4u"],
      a: 1
    },
    {
      q: "The Cauchy-Riemann equations in polar coordinates (r, theta) are written as:",
      o: ["du/dr = (1/r)*dv/dtheta and dv/dr = -(1/r)*du/dtheta", "du/dr = dv/dtheta and dv/dr = -du/dtheta", "du/dtheta = r*dv/dr and dv/dtheta = -r*du/dr", "du/dr = -dv/dtheta and dv/dr = du/dtheta"],
      a: 0
    },
    {
      q: "What is the residue of the complex function f(z) = 1 / (z - 2) at its simple pole z = 2?",
      o: ["0", "1", "2", "-1"],
      a: 1
    },
    {
      q: "According to Cauchy's Integral Formula, if a closed contour C encloses z = a and f(z) is analytic, the integral of f(z)/(z-a) is:",
      o: ["f(a)", "2 * pi * i * f(a)", "pi * i * f(a)", "0"],
      a: 1
    },
    {
      q: "A numerical sequence a_n is bounded if there exists a positive number M such that:",
      o: ["|a_n| < M for all n", "a_n > M for all n", "a_n < -M for all n", "a_n = M for all n"],
      a: 0
    },
    {
      q: "What is the Laplace transform of the exponential function e^{at}?",
      o: ["1 / s", "1 / (s - a)", "1 / (s + a)", "a / (s^2 + a^2)"],
      a: 1
    },
    {
      q: "In complex variables z = x + iy, a function f(z) = u + iv is structurally analytic if:",
      o: ["It is continuous", "It satisfies the Cauchy-Riemann equations", "It has real values only", "It is bounded"],
      a: 1
    },
    {
      q: "The analytical method of separation of variables is widely used to solve which of these?",
      o: ["Ordinary differential equations", "Partial differential equations", "Linear algebraic equations", "Complex residues"],
      a: 1
    },
    {
      q: "The general complementary solution of the higher-order differential equation (D^2 - 4)y = 0 is:",
      o: ["C1*cos(2x) + C2*sin(2x)", "C1*e^{2x} + C2*e^{-2x}", "(C1 + C2*x)*e^{2x}", "C1*e^{4x} + C2*e^{-4x}"],
      a: 1
    },
    {
      q: "The integral of a complex function along a path is independent of the path if the function is:",
      o: ["Continuous", "Differentiable", "Analytic", "Bounded"],
      a: 2
    }
  ],
  "Environmental Studies": [
    {
      q: "Which of the following is categorized as a renewable energy resource?",
      o: ["Coal reserves", "Crude petroleum", "Solar energy", "Natural gas"],
      a: 2
    },
    {
      q: "The core concept of sustainable development focuses on meeting the needs of:",
      o: ["Present generations only", "Future generations only", "Present and future generations without compromising resources", "Heavy industrial sectors only"],
      a: 2
    },
    {
      q: "Deforestation typically leads to which of these direct environmental impacts?",
      o: ["Increased soil fertility", "Decreased greenhouse gases", "Soil erosion and massive loss of biodiversity", "Groundwater recharge"],
      a: 2
    },
    {
      q: "In an ecosystem structure, primary producers are represented by:",
      o: ["Herbivores", "Carnivores", "Green plants and photosynthetic algae", "Decomposers"],
      a: 2
    },
    {
      q: "The directional flow of energy in an ecological food chain is always:",
      o: ["Bidirectional", "Unidirectional", "Multidirectional", "Cyclic"],
      a: 1
    },
    {
      q: "Which of the following represents the most critical threat to global biodiversity?",
      o: ["Active reforestation", "Habitat destruction and fragmentation", "Conservation reserves", "Organic crop farming"],
      a: 2
    },
    {
      q: "Acid rain is primarily caused by atmospheric chemical reactions of SO2 and:",
      o: ["Carbon dioxide", "Nitrogen oxides (NOx)", "Methane", "Chlorofluorocarbons"],
      a: 1
    },
    {
      q: "The primary gaseous compound responsible for the greenhouse effect and global warming is:",
      o: ["Oxygen", "Carbon dioxide (CO2)", "Nitrogen", "Argon"],
      a: 1
    },
    {
      q: "Minamata disease in Japan was a tragic incident caused by bioaccumulation of:",
      o: ["Lead", "Cadmium", "Methyl mercury", "Arsenic"],
      a: 2
    },
    {
      q: "The central Indian Environment Protection Act was enacted in which year?",
      o: ["1974", "1981", "1986", "2000"],
      a: 2
    },
    {
      q: "The standard unit used for noise pollution and sound level measurement is:",
      o: ["Hertz (Hz)", "Decibel (dB)", "Pascal (Pa)", "Ampere (A)"],
      a: 1
    },
    {
      q: "Which of the following is an ex-situ method of global biodiversity conservation?",
      o: ["National Parks", "Wildlife Sanctuaries", "Zoological Gardens (Zoos)", "Biosphere Reserves"],
      a: 2
    },
    {
      q: "The Montreal Protocol is an international environmental treaty designed to protect the:",
      o: ["Biodiversity hot-spots", "Global climate temperature", "Ozone layer from depletion", "Wetland resources"],
      a: 2
    },
    {
      q: "Eutrophication in a stagnant water body is chemically triggered by excess accumulation of:",
      o: ["Heavy metal compounds", "Dissolved oxygen", "Nutrients like nitrates and phosphates", "Organic carbon"],
      a: 2
    },
    {
      q: "In an ecological food chain, decomposers are vital because they:",
      o: ["Capture solar energy", "Recycle vital nutrients back into the soil", "Are food for primary consumers", "Prevent soil erosion"],
      a: 1
    }
  ]
};

const SYLLABUS_TOPICS = [
  { subject: "Engineering Physics", topic: "Unit I: Interference & Diffraction (Thin Films, Newton's Rings)" },
  { subject: "Engineering Physics", topic: "Unit II: Polarization & Lasers (He-Ne, Ruby Laser, Fiber Optics)" },
  { subject: "Engineering Physics", topic: "Unit III: Electromagnetics & Magnetic Properties (Maxwell's Equations)" },
  { subject: "Engineering Physics", topic: "Unit IV: Quantum Mechanics (Heisenberg Uncertainty, Schrodinger Eq)" },
  { subject: "Engineering Physics", topic: "Unit V: Semiconductor Physics (Hall Effect, LEDs, Biasing)" },

  { subject: "Engineering Chemistry", topic: "Unit I: Atomic and Molecular Structure (MOT, CFT, de Broglie)" },
  { subject: "Engineering Chemistry", topic: "Unit II: Thermodynamic Functions (Nernst Equation, Hess Law)" },
  { subject: "Engineering Chemistry", topic: "Unit III: Water Chemistry & Corrosion (Reverse Osmosis, Softening)" },
  { subject: "Engineering Chemistry", topic: "Unit IV: Chemistry of Engineering Materials (Polymers, Lubricants)" },
  { subject: "Engineering Chemistry", topic: "Unit V: Spectroscopic Technique & Drug Synthesis (NMR, Aspirin)" },

  { subject: "Programming for Problem Solving", topic: "Unit I: Introduction & C Basics (Compiling, Variables, I/O)" },
  { subject: "Programming for Problem Solving", topic: "Unit II: Operators & Control Structures (Loops, If-Switch)" },
  { subject: "Programming for Problem Solving", topic: "Unit III: Arrays & Functions (Bubble/Quick/Merge Sort, Recursion)" },
  { subject: "Programming for Problem Solving", topic: "Unit IV: Strings & Pointers (Pointer Arithmetic, malloc)" },
  { subject: "Programming for Problem Solving", topic: "Unit V: Structures & File Handling (Unions, Read/Write Modes)" },

  { subject: "Basic Electronics Engineering", topic: "Unit I: Semiconductor Materials & Junction Diodes (Depletion Layer)" },
  { subject: "Basic Electronics Engineering", topic: "Unit II: Diode Applications & Breakdown (Rectifiers, Zener Regulator)" },
  { subject: "Basic Electronics Engineering", topic: "Unit III: Bipolar Junction Transistors (transistor action, CB/CE/CC)" },
  { subject: "Basic Electronics Engineering", topic: "Unit IV: Field Effect Transistors (JFET, MOSFET construction)" },
  { subject: "Basic Electronics Engineering", topic: "Unit V: Logic Design & Op-Amps (Boolean algebra, Logic Gates, Op-Amps)" },

  { subject: "Basic Electrical Engineering", topic: "Unit I: DC Circuits (Kirchhoff laws, Thevenin/Norton Theorems)" },
  { subject: "Basic Electrical Engineering", topic: "Unit II: AC Circuits (Phasors, Resonance, Three-Phase)" },
  { subject: "Basic Electrical Engineering", topic: "Unit III: Magnetic Circuits & Transformers (BH Curve, Losses)" },
  { subject: "Basic Electrical Engineering", topic: "Unit IV: Electrical Machines (DC Machines, Induction Motors)" },
  { subject: "Basic Electrical Engineering", topic: "Unit V: Electrical Installations (Switchgear MCB, Batteries)" },

  { subject: "Basic Mechanical Engineering", topic: "Unit I: Engineering Mechanics (Motion, Friction, Trusses)" },
  { subject: "Basic Mechanical Engineering", topic: "Unit II: Stress & Strain (carbon steels, Hooke's law, Stress-Strain)" },
  { subject: "Basic Mechanical Engineering", topic: "Unit III: Measurement & Fluid Mechanics (Pascal/Bernoulli, Pumps)" },
  { subject: "Basic Mechanical Engineering", topic: "Unit IV: Thermodynamics (Zeroth/First/Second Laws, Carnot)" },
  { subject: "Basic Mechanical Engineering", topic: "Unit V: Internal Combustion Engines (SI & CI Engines, Otto/Diesel)" },

  { subject: "Analytical Mathematics", topic: "Unit I: First Order Ordinary Differential Equations (Separable, exact)" },
  { subject: "Analytical Mathematics", topic: "Unit II: Ordinary Differential Equations of Higher Orders (Method of parameters)" },
  { subject: "Analytical Mathematics", topic: "Unit III: Sequences and Series (Ratio Test, alternating series, Fourier)" },
  { subject: "Analytical Mathematics", topic: "Unit IV: Partial Differential Equations (Separation of variables, Wave Eq)" },
  { subject: "Analytical Mathematics", topic: "Unit V: Functions of Complex Variable (Analytic functions, Residues)" },

  { subject: "Environmental Studies", topic: "Unit I: Natural Resources & Sustainable Development (Renewables)" },
  { subject: "Environmental Studies", topic: "Unit II: Ecosystems Structure, Function & Food Chains" },
  { subject: "Environmental Studies", topic: "Unit III: Biodiversity Conservation (Hotspots, threats)" },
  { subject: "Environmental Studies", topic: "Unit IV: Environmental Pollution (Air, water, solid waste management)" },
  { subject: "Environmental Studies", topic: "Unit V: Social Issues & Environmental Laws (Ozone layer, Kyoto)" }
];

function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconClass = 'fa-circle-info';
  if (type === 'success') {
    iconClass = 'fa-circle-check';
    if (window.playSynthSound) window.playSynthSound('success');
  } else if (type === 'level') {
    iconClass = 'fa-circle-up';
    if (window.playSynthSound) window.playSynthSound('unlock');
  } else if (type === 'xp') {
    iconClass = 'fa-bolt';
    if (window.playSynthSound) window.playSynthSound('click');
  } else if (type === 'alert') {
    iconClass = 'fa-triangle-exclamation';
    if (window.playSynthSound) window.playSynthSound('alert');
  }

  toast.innerHTML = `
    <i class="fa-solid ${iconClass} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

window.showToast = showToast;

function logSimulation(message) {
  const logBox = document.getElementById('sim-log-output');
  if (!logBox) return;
  const now = new Date(Date.now() + virtualTimeOffset);
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  logBox.innerHTML = `[${timeStr}] ${message}<br>` + logBox.innerHTML;
}

window.logSimulation = logSimulation;

function addCombatLog(msg, type = 'system') {
  const container = document.getElementById('combat-logs');
  if (!container) return;

  const log = document.createElement('div');
  log.className = `combat-log ${type}`;

  const now = new Date(Date.now() + virtualTimeOffset);
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  log.innerText = `[${timeStr}] ${msg}`;
  container.appendChild(log);

  while (container.children.length > 15) {
    container.children[0].remove();
  }
  container.scrollTop = container.scrollHeight;
}

function updateDashboardUI(user) {
  if (!user) return;
  currentUser = user;

  const nameEl = document.getElementById('user-display-name');
  const levelEl = document.getElementById('user-display-level');
  const hpEl = document.getElementById('header-hp');
  const goldEl = document.getElementById('header-gold');
  const shopGoldEl = document.getElementById('shop-gold-display');

  if (nameEl) nameEl.innerText = user.username;
  if (levelEl) levelEl.innerText = `Level ${user.level} (${user.branch || 'General'})`;
  if (hpEl) hpEl.innerText = `${user.hp} / 100`;
  if (goldEl) goldEl.innerText = `${user.gold} GP`;
  if (shopGoldEl) shopGoldEl.innerText = `${user.gold} GP`;

  const studentIdEl = document.getElementById('settings-student-id');
  const parentIdEl = document.getElementById('settings-parent-id');
  if (studentIdEl) studentIdEl.innerText = user.studentId || 'SSB0000';
  if (parentIdEl) parentIdEl.innerText = user.parentId || 'SSBP0000';

  const xpNeeded = user.level * 150;
  const xpPercent = Math.min(100, (user.xp / xpNeeded) * 100);

  const crRange = document.getElementById('xp-current-range');
  const xpPercLabel = document.getElementById('xp-percent');
  const xpFillBar = document.getElementById('xp-fill-bar');

  if (crRange) crRange.innerText = `${user.xp} / ${xpNeeded} XP`;
  if (xpPercLabel) xpPercLabel.innerText = `${Math.round(xpPercent)}% to Level ${user.level + 1}`;
  if (xpFillBar) xpFillBar.style.width = `${xpPercent}%`;

  const ring = document.getElementById('level-progress-ring');
  if (ring) {
    const levelOffset = 314.16 - (xpPercent / 100) * 314.16;
    ring.style.strokeDashoffset = levelOffset;
  }

  const statLvl = document.getElementById('stat-level');
  const statXp = document.getElementById('stat-xp');
  const statStreak = document.getElementById('stat-streak');

  if (statLvl) statLvl.innerText = user.level;
  if (statXp) statXp.innerText = user.xp;
  if (statStreak) statStreak.innerText = user.streak;

  const flameGraphic = document.getElementById('flame-graphic');
  const tagline = document.getElementById('streak-tagline');
  const badge = document.getElementById('streak-status-badge');

  if (flameGraphic) {
    if (user.streak === 0) {
      flameGraphic.className = "fa-solid fa-fire animated-flame";
      flameGraphic.style.filter = "grayscale(100%) opacity(30%)";
      if (tagline) tagline.innerText = "Spawn a study habit today!";
      if (badge) {
        badge.className = "badge badge-danger";
        badge.innerText = "Inactive";
      }
    } else {
      flameGraphic.className = "fa-solid fa-fire animated-flame";
      flameGraphic.style.filter = "";
      if (badge) {
        badge.className = "badge badge-success";
        badge.innerText = "Active";
      }

      if (user.streak >= 30) {
        flameGraphic.style.filter = "drop-shadow(0 0 25px #ec4899) hue-rotate(270deg)";
        if (tagline) tagline.innerText = "🌟 UNSTOPPABLE PRODUCTIVITY GENIUS!";
      } else if (user.streak >= 7) {
        flameGraphic.style.filter = "drop-shadow(0 0 18px #a855f7) hue-rotate(60deg)";
        if (tagline) tagline.innerText = "⚡ FOCUS WARRIOR UNLEASHED!";
      } else {
        flameGraphic.style.filter = "drop-shadow(0 0 10px #f97316)";
        if (tagline) tagline.innerText = "🔥 Hot streak! Keep building consistency.";
      }
    }
  }

  const freezeCount = document.getElementById('freeze-count');
  if (freezeCount) freezeCount.innerText = `${user.freezes} / 3`;

  const slots = document.getElementById('freeze-slots');
  if (slots) {
    const children = slots.children;
    for (let i = 0; i < 3; i++) {
      if (children[i]) {
        if (i < user.freezes) {
          children[i].classList.add('active');
        } else {
          children[i].classList.remove('active');
        }
      }
    }
  }

  const checkInBtn = document.getElementById('check-in-btn');
  const timeDesc = document.getElementById('check-in-time-desc');
  if (checkInBtn) {
    if (user.lastCheckIn) {
      const now = new Date(Date.now() + virtualTimeOffset);
      const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const last = new Date(user.lastCheckIn);
      const lastStr = `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, '0')}-${String(last.getDate()).padStart(2, '0')}`;

      if (nowStr === lastStr) {
        checkInBtn.classList.add('checked-in');
        checkInBtn.disabled = true;
        checkInBtn.querySelector('span').innerText = "Checked-In Today! (+10 XP)";
        if (timeDesc) timeDesc.innerText = "Great job! Next check-in opens tomorrow.";
      } else {
        checkInBtn.classList.remove('checked-in');
        checkInBtn.disabled = false;
        checkInBtn.querySelector('span').innerText = "Daily Check-In (+10 XP)";
        if (timeDesc) timeDesc.innerText = "Study consistency is key! Check-in to protect your streak.";
      }
    } else {
      checkInBtn.classList.remove('checked-in');
      checkInBtn.disabled = false;
      checkInBtn.querySelector('span').innerText = "Daily Check-In (+10 XP)";
      if (timeDesc) timeDesc.innerText = "Study consistency is key! Check-in to protect your streak.";
    }
  }

  const achievements = [
    { id: 'badge-warrior', name: '3-Day Warrior' },
    { id: 'badge-master', name: '7-Day Focus Master' },
    { id: 'badge-legend', name: '30-Day Legend' }
  ];

  let unlockedCount = 0;
  achievements.forEach(ach => {
    const tile = document.getElementById(ach.id);
    if (tile) {
      if (user.unlockedBadges.includes(ach.name)) {
        tile.classList.remove('locked');
        tile.classList.add('unlocked');
        unlockedCount++;
      } else {
        tile.classList.add('locked');
        tile.classList.remove('unlocked');
      }
    }
  });
  const badgesRatio = document.getElementById('badges-unlocked-ratio');
  if (badgesRatio) badgesRatio.innerText = `${unlockedCount} / 3 Unlocked`;

  const body = document.body;
  body.classList.remove('cyberpunk-theme', 'forest-theme', 'solar-theme');
  if (user.activeTheme === 'cyber') body.classList.add('cyberpunk-theme');
  else if (user.activeTheme === 'forest') body.classList.add('forest-theme');
  else if (user.activeTheme === 'solar') body.classList.add('solar-theme');

  const shopItems = [
    { id: 'buy-theme-default-btn', name: 'default' },
    { id: 'buy-theme-cyber-btn', name: 'cyber' },
    { id: 'buy-theme-forest-btn', name: 'forest' },
    { id: 'buy-theme-solar-btn', name: 'solar' }
  ];

  shopItems.forEach(item => {
    const btn = document.getElementById(item.id);
    if (!btn) return;
    const card = btn.closest('.shop-item');

    if (item.name === 'default' || user.unlockedThemes.includes(item.name)) {
      if (card) card.classList.add('unlocked-theme');
      const isEquipped = user.activeTheme === item.name || (item.name === 'default' && (!user.activeTheme || user.activeTheme === 'default'));
      if (isEquipped) {
        if (card) card.classList.add('active-theme');
        btn.querySelector('span').innerText = "EQUIPPED";
        btn.className = "btn btn-sm btn-accent buy-shop-item-btn equipped";
      } else {
        if (card) card.classList.remove('active-theme');
        btn.querySelector('span').innerText = "EQUIP";
        btn.className = "btn btn-sm btn-outline buy-shop-item-btn";
      }
    } else {
      if (card) {
        card.classList.remove('unlocked-theme');
        card.classList.remove('active-theme');
      }
      btn.className = "btn btn-sm btn-accent buy-shop-item-btn";
    }
  });

  const bossName = document.getElementById('boss-name');
  const bossLevelBadge = document.getElementById('boss-level-badge');
  const bossHpText = document.getElementById('boss-hp-text');
  const bossHpFill = document.getElementById('boss-hp-fill');
  const bossStatus = document.getElementById('boss-status');

  const names = [
    "Procrastination Shield",
    "Digital Distractions Barrier",
    "Doom-Scrolling Interrupt",
    "Social Media Deflection",
    "Inefficient Time Management",
    "Unstructured Study Habit"
  ];

  const bName = names[(user.bossLevel - 1) % names.length];
  if (bossName) bossName.innerText = bName;
  if (bossLevelBadge) bossLevelBadge.innerText = `STAGE ${user.bossLevel} GOAL TARGET`;
  if (bossHpText) bossHpText.innerText = `${user.bossHp} / ${user.bossMaxHp} Integrity`;

  if (bossHpFill) {
    const fillPercent = Math.max(0, (user.bossHp / user.bossMaxHp) * 100);
    bossHpFill.style.width = `${fillPercent}%`;
  }

  if (bossStatus) {
    if (user.bossHp > user.bossMaxHp * 0.5) {
      bossStatus.innerText = "Distraction forces are building up! Complete goals to protect your focus!";
    } else {
      bossStatus.innerText = "Distraction shield is critically weak! Keep studying to clear this stage!";
    }
  }

  // Parent Blessing Card dynamic render
  const parentMsgContainer = document.getElementById('parent-message-container');
  if (parentMsgContainer) {
    if (user.parentMessage && !user.parentMessageRead) {
      parentMsgContainer.innerHTML = `
        <div class="grid-card parent-message-card" style="background: linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.15) 100%); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 20px; padding: 1.4rem 1.6rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; box-shadow: 0 8px 32px 0 rgba(129, 140, 248, 0.1); animation: slideDown 0.5s ease-out;">
          <div style="display: flex; align-items: center; gap: 1.2rem; text-align: left;">
            <div style="background: rgba(168, 85, 247, 0.2); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #a855f7; flex-shrink: 0;">
              <i class="fa-solid fa-envelope-open-text animate-pulse"></i>
            </div>
            <div>
              <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.05rem; font-weight: 700; margin-bottom: 4px; color: #fff; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-heart" style="color: #ec4899;"></i> Parental Blessing &amp; Encouragement
              </h4>
              <p style="font-size: 0.88rem; color: rgba(255,255,255,0.9); font-style: italic; line-height: 1.4; margin: 0;">"${user.parentMessage}"</p>
            </div>
          </div>
          <button onclick="window.dismissParentMessage()" class="btn btn-outline btn-sm" style="border-radius: 10px; padding: 6px 14px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #fff;">
            <i class="fa-solid fa-circle-check" style="color: #34d399;"></i> Accept Blessing
          </button>
        </div>
      `;
    } else {
      parentMsgContainer.innerHTML = '';
    }
  }

  renderQuests(user.quests);
  if (window.renderAnalyticsChart) window.renderAnalyticsChart(user.focusHistory);

  // Study Pet UI Integration
  const adoptionModal = document.getElementById('pet-adoption-modal');
  const floatTrigger = document.getElementById('pet-chat-floating-trigger');
  if (adoptionModal) {
    if (!user.pet) {
      adoptionModal.classList.remove('hidden');
      if (floatTrigger) floatTrigger.classList.add('hidden');
    } else {
      adoptionModal.classList.add('hidden');
      if (floatTrigger) floatTrigger.classList.remove('hidden');
      renderStudyPetUI(user.pet);
    }
  }
}

window.dismissParentMessage = function () {
  if (!currentUser) return;
  currentUser.parentMessageRead = true;
  saveUserState(currentUser);

  if (window.playSynthSound) window.playSynthSound('success');
  showToast('Blessing Accepted!', 'Warm study vibes added to your focus desk! 💖', 'success');

  const card = document.querySelector('.parent-message-card');
  if (card) {
    card.style.animation = 'slideUp 0.4s ease-in forwards';
    card.addEventListener('animationend', () => {
      updateDashboardUI(currentUser);
    });
  } else {
    updateDashboardUI(currentUser);
  }
};

window.updateDashboardUI = updateDashboardUI;

window.toggleQuestModal = function (show) {
  const modal = document.getElementById('quest-spawner-modal');
  if (modal) modal.classList.toggle('hidden', !show);
};

window.toggleSettingsModal = function (show) {
  const modal = document.getElementById('settings-spawner-modal');
  if (modal) {
    modal.classList.toggle('hidden', !show);
    if (show) {
      if (window.playSynthSound) window.playSynthSound('click');

      // Populate AI Brain configurations
      const savedMode = localStorage.getItem('ss_gemini_brain_mode') || 'persona';
      const selectMode = document.getElementById('ai-brain-mode');
      if (selectMode) selectMode.value = savedMode;

      const savedKey = localStorage.getItem('ss_gemini_api_key') || '';
      const keyInput = document.getElementById('ai-gemini-key-input');
      if (keyInput) keyInput.value = savedKey;

      const keyContainer = document.getElementById('ai-brain-key-container');
      if (keyContainer) {
        keyContainer.classList.toggle('hidden', savedMode !== 'gemini');
      }
    }
  }
};

window.switchSettingsTab = function (tabName) {
  if (tabName === 'appearance') {
    window.showAppearancePopup(true);
  } else if (tabName === 'studyroom') {
    window.location.href = 'studyroom.html';
  } else if (tabName === 'pet') {
    window.showCompanionCarePopup(true);
  } else if (tabName === 'dev') {
    window.showDevPopup(true);
  }
};

function saveUserState(user) {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  users[user.username.toLowerCase()] = user;
  localStorage.setItem('users', JSON.stringify(users));
}

function spawnQuest(e) {
  e.preventDefault();
  const title = document.getElementById('quest-title-input').value.trim();
  const rarity = document.getElementById('quest-rarity-select').value;

  if (!title || !currentUser) return;

  const newQuest = {
    id: 'quest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    title,
    rarity,
    completed: false,
    createdAt: new Date().toISOString()
  };

  currentUser.quests.push(newQuest);
  saveUserState(currentUser);

  addCombatLog(`📜 Added Goal: "${title}" (${rarity.toUpperCase()})`, 'system');
  showToast('Goal Added!', `Active Goal: "${title}" is ready.`, 'info');

  document.getElementById('quest-spawn-form').reset();
  window.toggleQuestModal(false);
  updateDashboardUI(currentUser);
}

function renderQuests(quests) {
  const container = document.getElementById('quests-container');
  if (!container) return;

  if (!quests || quests.length === 0) {
    container.innerHTML = `
      <div class="empty-quests-message">
        <i class="fa-solid fa-list"></i> No active goals. Click "Add Goal" to begin!
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  quests.forEach(quest => {
    const item = document.createElement('div');
    item.className = `quest-item rarity-${quest.rarity} ${quest.completed ? 'completed' : ''}`;

    let rewardsText = "";
    if (quest.rarity === 'common') rewardsText = "+10 XP & 10 GP & 10 Focus Power";
    else if (quest.rarity === 'rare') rewardsText = "+20 XP & 20 GP & 20 Focus Power";
    else if (quest.rarity === 'epic') rewardsText = "+40 XP & 40 GP & 80 Focus Power";
    else if (quest.rarity === 'legendary') rewardsText = "+80 XP & 80 GP & 240 Focus Power";

    item.innerHTML = `
      <div class="quest-checkbox-wrapper">
        <div class="quest-check" onclick="completeQuest('${quest.id}')">
          <i class="fa-solid fa-check"></i>
        </div>
      </div>
      <div class="quest-info-block">
        <div class="quest-title">${quest.title}</div>
        <div class="quest-meta-row">
          <span class="quest-rarity-badge">${quest.rarity}</span>
          <span class="quest-rewards-text">${rewardsText}</span>
        </div>
      </div>
      <button class="delete-quest-btn" onclick="discardQuest('${quest.id}')" title="Discard Quest">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    container.appendChild(item);
  });
}

window.completeQuest = function (questId) {
  if (!currentUser) return;
  const quest = currentUser.quests.find(q => q.id === questId);
  if (!quest) return;

  quest.completed = true;

  let xp = 0, gold = 0, bossDmg = 0;
  if (quest.rarity === 'common') { xp = 10; gold = 10; bossDmg = 10; }
  else if (quest.rarity === 'rare') { xp = 20; gold = 20; bossDmg = 20; }
  else if (quest.rarity === 'epic') { xp = 40; gold = 40; bossDmg = 80; }
  else if (quest.rarity === 'legendary') { xp = 80; gold = 80; bossDmg = 240; }

  currentUser.gold += gold;
  currentUser.xp += xp;
  currentUser.bossHp -= bossDmg;
  currentUser.hp = Math.min(100, currentUser.hp + (currentUser.level * 2));

  if (window.playSynthSound) window.playSynthSound('slash');
  const slash = document.getElementById('boss-slash');
  if (slash) {
    slash.classList.remove('hidden');
    void slash.offsetWidth;
    setTimeout(() => { slash.classList.add('hidden'); }, 400);
  }

  const bossCard = document.querySelector('.boss-encounter-card');
  if (bossCard) {
    bossCard.classList.add('boss-damage-shake');
    setTimeout(() => { bossCard.classList.remove('boss-damage-shake'); }, 400);
  }

  let nextLevelXP = currentUser.level * 150;
  while (currentUser.xp >= nextLevelXP) {
    currentUser.xp -= nextLevelXP;
    currentUser.level++;
    nextLevelXP = currentUser.level * 150;
  }

  if (currentUser.bossHp <= 0) {
    currentUser.gold += currentUser.bossLevel * 50 + 50;
    currentUser.xp += currentUser.bossLevel * 100;
    currentUser.bossLevel++;
    currentUser.bossMaxHp = currentUser.bossLevel * 100;
    currentUser.bossHp = currentUser.bossMaxHp;

    nextLevelXP = currentUser.level * 150;
    while (currentUser.xp >= nextLevelXP) {
      currentUser.xp -= nextLevelXP;
      currentUser.level++;
      nextLevelXP = currentUser.level * 150;
    }
  }

  // Reward pet on goal complete
  if (currentUser.pet) {
    if (currentUser.pet.hp > 0) {
      currentUser.pet.xp += 25;
      currentUser.pet.happiness = Math.min(100, currentUser.pet.happiness + 15);

      let petXpNeeded = currentUser.pet.level * 100;
      while (currentUser.pet.xp >= petXpNeeded) {
        currentUser.pet.xp -= petXpNeeded;
        currentUser.pet.level++;
        petXpNeeded = currentUser.pet.level * 100;
      }

      let prefix = "Meow! ";
      if (currentUser.pet.type === 'Zen Panda') prefix = "Serene energy... ";
      else if (currentUser.pet.type === 'Knowledge Dragon') prefix = "AN EXCELLENT CONQUEST! ";
      else if (currentUser.pet.type === 'Smart Fox') prefix = "Goal cracked, smart move! ";
      else if (currentUser.pet.type === 'Chill Penguin') prefix = "Totally smooth tasking, friend! ";
      else if (currentUser.pet.type === 'Pixel Robot') prefix = "QUEST EVALUATION VERIFIED. ";

      const chatLog = { sender: 'pet', text: prefix + `You completed the goal: "${quest.title}"! I gained +25 XP and +15 Happiness!` };
      if (!currentUser.pet.chatHistory) currentUser.pet.chatHistory = [];
      currentUser.pet.chatHistory.push(chatLog);
      while (currentUser.pet.chatHistory.length > 25) currentUser.pet.chatHistory.shift();
    }
  }

  currentUser.quests = currentUser.quests.filter(q => q.id !== questId);
  saveUserState(currentUser);

  showToast('Goal Completed!', `+${gold} GP and +${xp} XP study points awarded. Distraction shield reduced by ${bossDmg}!`, 'success');
  addCombatLog(`💥 Completed study goal. Reduced procrastination shield by ${bossDmg} points!`, 'player-hit');
  updateDashboardUI(currentUser);
};

window.discardQuest = function (questId) {
  if (!currentUser) return;
  currentUser.quests = currentUser.quests.filter(q => q.id !== questId);
  saveUserState(currentUser);
  addCombatLog('Study goal removed from active list.', 'system');
  updateDashboardUI(currentUser);
};

function buyShopItem(itemId, cost) {
  if (!currentUser) return;

  if (itemId === 'theme-default') {
    currentUser.activeTheme = 'default';
    showToast('Theme Changed', 'Theme updated to ORIGINAL SLATE', 'info');
    saveUserState(currentUser);
    updateDashboardUI(currentUser);
    return;
  }

  // If equipping an already-purchased theme, let them do it for free!
  if (itemId.startsWith('theme-')) {
    const skinName = itemId.split('theme-')[1];
    if (currentUser.unlockedThemes.includes(skinName)) {
      currentUser.activeTheme = currentUser.activeTheme === skinName ? 'default' : skinName;
      showToast('Theme Changed', `Theme updated to ${currentUser.activeTheme.toUpperCase()}`, 'info');
      saveUserState(currentUser);
      updateDashboardUI(currentUser);
      return;
    }
  }

  if (currentUser.gold < cost) {
    showToast('Insufficient Gold', 'Complete tasks or Pomodoros to accumulate Gold!', 'alert');
    return;
  }

  if (itemId === 'freeze') {
    if (currentUser.freezes >= 5) {
      showToast('Max Slots Reached', 'You can only store up to 5 Streak Freezes!', 'alert');
      return;
    }
    currentUser.gold -= cost;
    currentUser.freezes++;
    showToast('Freeze Purchased!', '❄️ Stored 1 Streak Freeze!', 'success');
    addCombatLog(`❄️ Bought 1 Streak Freeze. (${currentUser.freezes}/5 stored)`, 'system');
  }
  else if (itemId.startsWith('theme-')) {
    const skinName = itemId.split('theme-')[1];
    // Since we already intercepted unlocked themes above, this is a new purchase.
    currentUser.gold -= cost;
    currentUser.unlockedThemes.push(skinName);
    currentUser.activeTheme = skinName;
    showToast('Theme Unlocked!', `🏆 Premium theme equipped: ${skinName.toUpperCase()}`, 'success');
    addCombatLog(`🎨 Purchased and equipped visual theme: "${skinName.toUpperCase()}"!`, 'system');
  }

  saveUserState(currentUser);
  updateDashboardUI(currentUser);
}

// --- 6. 3D DICE & B.TECH SYLLABUS DUEL ---
let activeDuelTopic = null;
let duelTimerInterval = null;
let duelTimeLeft = 3600;
let activeDuelQuestions = [];
let currentMcqIndex = 0;
let userSelectedAnswers = {};

function rollSyllabusDice() {
  if (!currentUser) return;
  if (window.playSynthSound) window.playSynthSound('click');

  const dice = document.getElementById('visual-dice');
  const rollBtn = document.getElementById('roll-dice-btn');

  if (!dice || rollBtn.disabled) return;

  rollBtn.disabled = true;
  dice.classList.add('rolling');
  logSimulation("Rolling the 3D Dice of Destiny...");

  const isGroupA = ['CSE++', 'CSE core'].includes(currentUser.branch);
  const activeSubjects = isGroupA
    ? ["Basic Mechanical Engineering", "Basic Electronics Engineering", "Engineering Chemistry", "Analytical Mathematics"]
    : ["Analytical Mathematics", "Basic Electrical Engineering", "Engineering Physics", "Programming for Problem Solving", "Environmental Studies"];

  const filteredTopics = SYLLABUS_TOPICS.filter(item => activeSubjects.includes(item.subject));
  const randIndex = Math.floor(Math.random() * filteredTopics.length);
  activeDuelTopic = filteredTopics[randIndex];

  setTimeout(() => {
    dice.classList.remove('rolling');

    const faceRotation = [
      "rotateX(0deg) rotateY(0deg)",
      "rotateX(0deg) rotateY(-90deg)",
      "rotateX(0deg) rotateY(180deg)",
      "rotateX(0deg) rotateY(90deg)",
      "rotateX(-90deg) rotateY(0deg)",
      "rotateX(90deg) rotateY(0deg)"
    ];

    const subjectIndex = activeSubjects.indexOf(activeDuelTopic.subject);
    dice.style.transform = faceRotation[subjectIndex >= 0 ? subjectIndex : 0];

    setTimeout(() => {
      document.getElementById('duel-roll-screen').classList.add('hidden');
      document.getElementById('duel-topic-screen').classList.remove('hidden');

      document.getElementById('duel-revealed-subject').innerText = activeDuelTopic.subject;
      document.getElementById('duel-revealed-topic').innerText = activeDuelTopic.topic;

      rollBtn.disabled = false;
      logSimulation(`Dice landed on: ${activeDuelTopic.subject} -> ${activeDuelTopic.topic}`);
      showToast('Topic Selected!', `${activeDuelTopic.subject} revealed! Prepare to duel.`, 'success');
    }, 400);

  }, 1800);
}

function rerollSyllabusDice() {
  if (!currentUser) return;

  if (currentUser.gold < 10) {
    showToast('Insufficient Gold', 'Rerolling the syllabus dice costs 10 GP!', 'alert');
    return;
  }

  currentUser.gold -= 10;
  saveUserState(currentUser);
  showToast('Syllabus Dice Reset', 'Spent 10 GP to reroll the dice!', 'info');
  logSimulation('Rerolled the Syllabus Dice. Deducted 10 GP.');

  document.getElementById('duel-topic-screen').classList.add('hidden');
  document.getElementById('duel-roll-screen').classList.remove('hidden');

  const dice = document.getElementById('visual-dice');
  if (dice) dice.style.transform = "rotateX(-30deg) rotateY(45deg)";
  updateDashboardUI(currentUser);
}

function startSyllabusDuelTest() {
  if (!activeDuelTopic) return;

  if (window.playSynthSound) window.playSynthSound('click');
  logSimulation(`Starting B.Tech test challenge for: ${activeDuelTopic.subject}`);

  const allQuestions = SUBJECT_QUESTIONS[activeDuelTopic.subject] || [];
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  activeDuelQuestions = shuffled.slice(0, 10);

  currentMcqIndex = 0;
  userSelectedAnswers = {};

  duelTimeLeft = 3600;
  renderDuelTimerClock();

  if (duelTimerInterval) clearInterval(duelTimerInterval);
  duelTimerInterval = setInterval(() => {
    duelTimeLeft--;
    renderDuelTimerClock();

    if (duelTimeLeft <= 0) {
      logSimulation("Time limit reached! Auto-submitting Syllabus Test Duel...");
      showToast('Time Limit Reached!', '60 minutes expired. Auto-submitting test scores.', 'alert');
      submitSyllabusDuelTest();
    }
  }, 1000);

  renderMcqQuestion();

  document.getElementById('duel-topic-screen').classList.add('hidden');
  document.getElementById('duel-test-screen').classList.remove('hidden');
}

function renderDuelTimerClock() {
  const display = document.getElementById('duel-timer-clock');
  if (!display) return;
  const minutes = Math.floor(duelTimeLeft / 60);
  const seconds = duelTimeLeft % 60;
  display.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function renderMcqQuestion() {
  const mcqContainer = document.getElementById('duel-mcq-container');
  const progInd = document.getElementById('duel-progress-indicator');
  const prevBtn = document.getElementById('prev-mcq-btn');
  const nextBtn = document.getElementById('next-mcq-btn');
  const submitBtn = document.getElementById('submit-mcq-btn');

  if (!mcqContainer || activeDuelQuestions.length === 0) return;

  const currentQ = activeDuelQuestions[currentMcqIndex];
  progInd.innerText = `Question ${currentMcqIndex + 1} of 10`;

  const optionLetters = ['A', 'B', 'C', 'D'];
  let optionsHtml = '';

  currentQ.o.forEach((opt, idx) => {
    const isSelected = userSelectedAnswers[currentMcqIndex] === idx;
    optionsHtml += `
      <div class="mcq-option ${isSelected ? 'selected' : ''}" onclick="selectMcqOption(${idx})">
        <div class="option-letter">${optionLetters[idx]}</div>
        <div class="option-text">${opt}</div>
      </div>
    `;
  });

  mcqContainer.innerHTML = `
    <div class="mcq-question">${currentQ.q}</div>
    <div class="mcq-options-grid">
      ${optionsHtml}
    </div>
  `;

  if (prevBtn) prevBtn.disabled = currentMcqIndex === 0;

  if (currentMcqIndex === 9) {
    if (nextBtn) nextBtn.classList.add('hidden');
    if (submitBtn) submitBtn.classList.remove('hidden');
  } else {
    if (nextBtn) nextBtn.classList.remove('hidden');
    if (submitBtn) submitBtn.classList.add('hidden');
  }
}

window.selectMcqOption = function (optionIndex) {
  if (window.playSynthSound) window.playSynthSound('click');
  userSelectedAnswers[currentMcqIndex] = optionIndex;
  renderMcqQuestion();
};

window.prevMcqQuestion = function () {
  if (currentMcqIndex > 0) {
    currentMcqIndex--;
    renderMcqQuestion();
  }
};

window.nextMcqQuestion = function () {
  if (currentMcqIndex < 9) {
    currentMcqIndex++;
    renderMcqQuestion();
  }
};

function submitSyllabusDuelTest() {
  if (duelTimerInterval) clearInterval(duelTimerInterval);
  if (!currentUser) return;

  let userScore = 0;
  activeDuelQuestions.forEach((q, idx) => {
    if (userSelectedAnswers[idx] === q.a) userScore++;
  });

  const sophiaScore = Math.floor(Math.random() * 3) + 8;
  const marcusScore = Math.floor(Math.random() * 4) + 6;
  const oliverScore = Math.floor(Math.random() * 4) + 5;
  const avaScore = Math.floor(Math.random() * 4) + 5;

  const competitors = [
    { username: currentUser.username, score: userScore, isUser: true },
    { username: "Sophia (FocusQueen)", score: sophiaScore, isUser: false },
    { username: "Marcus (StudyKnight)", score: marcusScore, isUser: false },
    { username: "Oliver (PomodoroKing)", score: oliverScore, isUser: false },
    { username: "Ava (ConsistencyGuru)", score: avaScore, isUser: false }
  ];

  competitors.sort((a, b) => b.score - a.score);

  const maxRivalScore = Math.max(sophiaScore, marcusScore, oliverScore, avaScore);
  const userWon = userScore >= maxRivalScore;

  const rivalsContainer = document.getElementById('duel-rivals-list');
  if (rivalsContainer) {
    rivalsContainer.innerHTML = '';
    competitors.forEach((rival, idx) => {
      rivalsContainer.innerHTML += `
        <div class="duel-rival-row ${rival.isUser ? 'user-row' : ''} ${idx === 0 ? 'rank-1-row' : ''}">
          <div>
            <span class="rival-rank-badge">${idx + 1}</span>
            <span>${rival.username}</span>
          </div>
          <span class="rival-score-val">${rival.score} / 10</span>
        </div>
      `;
    });
  }

  const outcomeHeader = document.getElementById('duel-outcome-header');
  const outcomeTitle = document.getElementById('duel-outcome-title');
  const outcomeDesc = document.getElementById('duel-outcome-desc');
  const rewardsContainer = document.getElementById('duel-rewards-summary');

  let gpReward = userWon ? 100 : 20;
  let xpReward = userWon ? 50 : 15;
  let bossDmg = userWon ? 100 : 20;

  if (userWon) {
    if (outcomeHeader) {
      outcomeHeader.className = "duel-outcome-header victory";
      outcomeHeader.querySelector('.outcome-trophy').innerHTML = `<i class="fa-solid fa-trophy text-gold"></i>`;
    }
    if (outcomeTitle) outcomeTitle.innerText = "🏆 EPIC VICTORY!";
    if (outcomeDesc) outcomeDesc.innerText = `You scored ${userScore}/10 and secured the top spot against your rivals on ${activeDuelTopic.subject}!`;
    if (window.playSynthSound) window.playSynthSound('success');
    addCombatLog(`👑 DUEL VICTORY: Defeated B.Tech rivals in ${activeDuelTopic.subject} test!`, 'system');
  } else {
    if (outcomeHeader) {
      outcomeHeader.className = "duel-outcome-header defeat";
      outcomeHeader.querySelector('.outcome-trophy').innerHTML = `<i class="fa-solid fa-shield text-gray"></i>`;
    }
    if (outcomeTitle) outcomeTitle.innerText = "🛡️ DUEL COMPLETED";
    if (outcomeDesc) outcomeDesc.innerText = `You placed below the top score on ${activeDuelTopic.subject}. Revise harder to defeat them next time!`;
    if (window.playSynthSound) window.playSynthSound('alert');
    addCombatLog(`⚔️ DUEL FINISHED: Completed ${activeDuelTopic.subject} test challenge.`, 'system');
  }

  if (rewardsContainer) {
    rewardsContainer.innerHTML = `
      <div class="reward-badge xp-reward"><i class="fa-solid fa-bolt"></i> +${xpReward} XP</div>
      <div class="reward-badge gold-reward"><i class="fa-solid fa-coins"></i> +${gpReward} GP</div>
      <div class="reward-badge xp-reward" style="color: var(--danger-color); border-color: rgba(239, 68, 68, 0.2);"><i class="fa-solid fa-burst"></i> +${bossDmg} DMG</div>
    `;
  }

  currentUser.gold += gpReward;
  currentUser.xp += xpReward;
  currentUser.bossHp -= bossDmg;

  let nextLevelXP = currentUser.level * 150;
  while (currentUser.xp >= nextLevelXP) {
    currentUser.xp -= nextLevelXP;
    currentUser.level++;
    nextLevelXP = currentUser.level * 150;
  }

  if (currentUser.bossHp <= 0) {
    currentUser.gold += currentUser.bossLevel * 50 + 50;
    currentUser.xp += currentUser.bossLevel * 100;
    currentUser.bossLevel++;
    currentUser.bossMaxHp = currentUser.bossLevel * 100;
    currentUser.bossHp = currentUser.bossMaxHp;

    nextLevelXP = currentUser.level * 150;
    while (currentUser.xp >= nextLevelXP) {
      currentUser.xp -= nextLevelXP;
      currentUser.level++;
      nextLevelXP = currentUser.level * 150;
    }
  }

  // Reward pet on MCQ Syllabus test complete
  if (currentUser.pet) {
    if (currentUser.pet.hp > 0) {
      currentUser.pet.xp += 35;
      currentUser.pet.happiness = Math.min(100, currentUser.pet.happiness + 30);

      let petXpNeeded = currentUser.pet.level * 100;
      while (currentUser.pet.xp >= petXpNeeded) {
        currentUser.pet.xp -= petXpNeeded;
        currentUser.pet.level++;
        petXpNeeded = currentUser.pet.level * 100;
      }

      let prefix = "Meow! ";
      if (currentUser.pet.type === 'Zen Panda') prefix = "Serene energy flowing... ";
      else if (currentUser.pet.type === 'Knowledge Dragon') prefix = "A VICTORIOUS STUDY CAMPAIGN! ";
      else if (currentUser.pet.type === 'Smart Fox') prefix = "MCQ test cracked! Clever focus! ";
      else if (currentUser.pet.type === 'Chill Penguin') prefix = "Totally aced the syllabus test, buddy! ";
      else if (currentUser.pet.type === 'Pixel Robot') prefix = "RANDOMIZER MCQS COMPILATION SUCCESSFUL. ";

      const chatLog = { sender: 'pet', text: prefix + `You completed the MCQ Revision test challenge on ${activeDuelTopic.subject}! I gained +35 XP and +30 Happiness!` };
      if (!currentUser.pet.chatHistory) currentUser.pet.chatHistory = [];
      currentUser.pet.chatHistory.push(chatLog);
      while (currentUser.pet.chatHistory.length > 25) currentUser.pet.chatHistory.shift();
    }
  }

  saveUserState(currentUser);
  updateDashboardUI(currentUser);

  document.getElementById('duel-test-screen').classList.add('hidden');
  document.getElementById('duel-results-screen').classList.remove('hidden');
}

window.finishSyllabusDuel = function () {
  if (window.playSynthSound) window.playSynthSound('click');
  document.getElementById('duel-results-screen').classList.add('hidden');
  document.getElementById('duel-roll-screen').classList.remove('hidden');

  const dice = document.getElementById('visual-dice');
  if (dice) dice.style.transform = "rotateX(-30deg) rotateY(45deg)";

  activeDuelTopic = null;
  activeDuelQuestions = [];
  userSelectedAnswers = {};
};

window.warpDuelTimer = function () {
  if (document.getElementById('duel-test-screen').classList.contains('hidden')) {
    showToast('Start Challenge First', 'Please start a syllabus challenge test before warping the trial clock.', 'alert');
    return;
  }

  if (window.playSynthSound) window.playSynthSound('click');
  duelTimeLeft = 5;
  renderDuelTimerClock();
  showToast('Duel Clock Warped!', 'Syllabus duel timer sped up! 5 seconds left on the trial.', 'info');
  logSimulation('Warped Syllabus Dice Duel timer countdown to 5s.');
};

// --- 7. DEVELOPER SIMULATOR ACTIONS ---
function evaluateStreakWindow(nowVal) {
  if (!currentUser || !currentUser.lastCheckIn) return;

  const now = new Date(nowVal);
  const lastCheck = new Date(currentUser.lastCheckIn);

  const dateStrNow = getSimulatedDateString(now);
  const dateStrLast = getSimulatedDateString(lastCheck);

  if (dateStrNow === dateStrLast) return;

  const nextDay = new Date(lastCheck);
  nextDay.setDate(nextDay.getDate() + 1);
  const dateStrNext = getSimulatedDateString(nextDay);

  if (dateStrNow === dateStrNext) return;

  const daysPassed = calculateDaysDifference(lastCheck, now);

  if (daysPassed >= 2) {
    const freezesNeeded = daysPassed - 1;
    let freezesUsed = 0;

    while (currentUser.freezes > 0 && currentUser.streak > 0 && freezesUsed < freezesNeeded) {
      currentUser.freezes--;
      freezesUsed++;
    }

    if (freezesUsed > 0) {
      const mockCheckIn = new Date(now);
      mockCheckIn.setDate(mockCheckIn.getDate() - (freezesNeeded - freezesUsed + 1));
      currentUser.lastCheckIn = mockCheckIn.toISOString();

      const bossDmg = 10 * freezesUsed;
      currentUser.hp -= bossDmg;

      // Pet companion decay on freeze consumption
      if (currentUser.pet) {
        currentUser.pet.hp = Math.max(0, currentUser.pet.hp - 15);
        currentUser.pet.happiness = Math.max(0, currentUser.pet.happiness - 20);

        let prefix = "Meow... ";
        if (currentUser.pet.type === 'Zen Panda') prefix = "The garden is dry... ";
        else if (currentUser.pet.type === 'Knowledge Dragon') prefix = "THE ACADEMIC SHIELD FLICKERS! ";
        else if (currentUser.pet.type === 'Smart Fox') prefix = "Streak freeze used, high alert! ";
        else if (currentUser.pet.type === 'Chill Penguin') prefix = "Uh-oh, getting a bit frosty here... ";
        else if (currentUser.pet.type === 'Pixel Robot') prefix = "SYSTEM POWER DRAIN DETECTED. ";

        const chatLog = { sender: 'pet', text: prefix + `We missed study days and used ${freezesUsed} freeze(s). I got lonely and hungry: -15 Health, -20 Happiness!` };
        if (!currentUser.pet.chatHistory) currentUser.pet.chatHistory = [];
        currentUser.pet.chatHistory.push(chatLog);
        while (currentUser.pet.chatHistory.length > 25) currentUser.pet.chatHistory.shift();
      }

      showToast('Streak Frozen!', `❄️ Missed ${daysPassed - 1} study days! ${freezesUsed} Streak Freeze(s) automatically used to protect your ${currentUser.streak}-day streak! Took ${bossDmg} HP penalty.`, 'success');
      addCombatLog(`Streak saved by Freeze protection! Consumed ${freezesUsed} Freeze(s).`, 'system');
    } else {
      if (currentUser.streak > 0) {
        // Pet massive damage on streak defeat
        if (currentUser.pet) {
          currentUser.pet.hp = Math.max(0, currentUser.pet.hp - 50);
          currentUser.pet.happiness = Math.max(0, currentUser.pet.happiness - 40);

          let prefix = "Meow... *sobbing* ";
          if (currentUser.pet.type === 'Zen Panda') prefix = "A great disturbance in the force... ";
          else if (currentUser.pet.type === 'Knowledge Dragon') prefix = "THE ACADEMIC SHIELD CRUMBLED! ";
          else if (currentUser.pet.type === 'Smart Fox') prefix = "Logic failure! Streak lost! ";
          else if (currentUser.pet.type === 'Chill Penguin') prefix = "Total freeze crash! So uncool... ";
          else if (currentUser.pet.type === 'Pixel Robot') prefix = "CRITICAL FAILURE: STREAK VALUE DISSOLVED. ";

          const chatLog = { sender: 'pet', text: prefix + `Our ${currentUser.streak}-day study streak is lost! I took massive damage: -50 Health, -40 Happiness!` };
          if (!currentUser.pet.chatHistory) currentUser.pet.chatHistory = [];
          currentUser.pet.chatHistory.push(chatLog);
          while (currentUser.pet.chatHistory.length > 25) currentUser.pet.chatHistory.shift();
        }

        showToast('Streak Defeated', `🔥 Your ${currentUser.streak}-day streak was lost because you missed your study target!`, 'alert');
        addCombatLog(`Streak lost! Reset from ${currentUser.streak} to 0. Took 30 DMG.`, 'boss-hit');
        currentUser.streak = 0;
        currentUser.hp -= 30;
      } else {
        if (currentUser.pet) {
          currentUser.pet.hp = Math.max(0, currentUser.pet.hp - 10);
          currentUser.pet.happiness = Math.max(0, currentUser.pet.happiness - 15);

          let prefix = "Meow... ";
          if (currentUser.pet.type === 'Zen Panda') prefix = "Stillness is not laziness... ";
          else if (currentUser.pet.type === 'Knowledge Dragon') prefix = "A DAY WITHOUT STUDY IS A LOSS! ";

          const chatLog = { sender: 'pet', text: `We missed our study goal again! I lost -10 Health and -15 Happiness.` };
          if (!currentUser.pet.chatHistory) currentUser.pet.chatHistory = [];
          currentUser.pet.chatHistory.push(chatLog);
          while (currentUser.pet.chatHistory.length > 25) currentUser.pet.chatHistory.shift();
        }

        currentUser.hp -= 15;
        addCombatLog(`Missed study day target! Took 15 DMG.`, 'boss-hit');
      }
    }

    if (currentUser.hp <= 0) {
      showToast('WIPED OUT!', 'Your health reached 0. You resurrected at Level 1!', 'alert');
      addCombatLog(`💀 Wiped out! Resurrecting character back at Level 1...`, 'system');

      currentUser.hp = 100;
      currentUser.gold = 0;
      currentUser.xp = 0;
      currentUser.level = 1;
      currentUser.streak = 0;
      currentUser.freezes = 3;
      currentUser.quests = [];
      currentUser.unlockedThemes = [];
      currentUser.activeTheme = 'default';
      currentUser.bossLevel = 1;
      currentUser.bossMaxHp = 100;
      currentUser.bossHp = 100;
      currentUser.lastCheckIn = null;
      currentUser.unlockedBadges = [];
      currentUser.focusHistory = [0, 0, 0, 0, 0, 0, 0];
    }

    saveUserState(currentUser);
  }
}

function simulateNextDay() {
  if (window.playSynthSound) window.playSynthSound('click');

  virtualTimeOffset += 24 * 60 * 60 * 1000;
  localStorage.setItem('virtualTimeOffset', virtualTimeOffset);

  const newSimTime = new Date(Date.now() + virtualTimeOffset);
  logSimulation(`Advanced time by 24 hours. Virtual Clock: ${newSimTime.toLocaleString()}`);
  showToast('Day Advanced', 'Simulated system date shifted forward by 24 hours.', 'info');

  evaluateStreakWindow(newSimTime);
  updateDashboardUI(currentUser);
}

function performDailyCheckIn() {
  if (!currentUser) return;

  const now = new Date(Date.now() + virtualTimeOffset);
  currentUser.lastCheckIn = now.toISOString();
  currentUser.streak++;
  currentUser.gold += 10;
  currentUser.xp += 10;
  currentUser.bossHp -= 15;

  let nextLevelXP = currentUser.level * 150;
  while (currentUser.xp >= nextLevelXP) {
    currentUser.xp -= nextLevelXP;
    currentUser.level++;
    nextLevelXP = currentUser.level * 150;
  }

  if (currentUser.bossHp <= 0) {
    currentUser.gold += currentUser.bossLevel * 50 + 50;
    currentUser.xp += currentUser.bossLevel * 100;
    currentUser.bossLevel++;
    currentUser.bossMaxHp = currentUser.bossLevel * 100;
    currentUser.bossHp = currentUser.bossMaxHp;

    nextLevelXP = currentUser.level * 150;
    while (currentUser.xp >= nextLevelXP) {
      currentUser.xp -= nextLevelXP;
      currentUser.level++;
      nextLevelXP = currentUser.level * 150;
    }
  }

  // Reward pet on check-in
  if (currentUser.pet) {
    if (currentUser.pet.hp > 0) {
      currentUser.pet.hp = Math.min(100, currentUser.pet.hp + 25);
      currentUser.pet.happiness = Math.min(100, currentUser.pet.happiness + 20);
      currentUser.pet.xp += 30;

      let petXpNeeded = currentUser.pet.level * 100;
      while (currentUser.pet.xp >= petXpNeeded) {
        currentUser.pet.xp -= petXpNeeded;
        currentUser.pet.level++;
        petXpNeeded = currentUser.pet.level * 100;
      }

      let prefix = "Meow! ";
      if (currentUser.pet.type === 'Zen Panda') prefix = "Breathe in... ";
      else if (currentUser.pet.type === 'Knowledge Dragon') prefix = "EXCELLENT DISCIPLINE! ";
      else if (currentUser.pet.type === 'Smart Fox') prefix = "Consistency hack logged! ";
      else if (currentUser.pet.type === 'Chill Penguin') prefix = "Aww yeah, cool streak! ";
      else if (currentUser.pet.type === 'Pixel Robot') prefix = "LOGICAL CHECK-IN VERIFIED. ";

      const chatLog = { sender: 'pet', text: prefix + `Thank you for defending our study streak! I got +25 Health, +20 Happiness, and +30 XP!` };
      if (!currentUser.pet.chatHistory) currentUser.pet.chatHistory = [];
      currentUser.pet.chatHistory.push(chatLog);
      while (currentUser.pet.chatHistory.length > 25) currentUser.pet.chatHistory.shift();
    }
  }

  saveUserState(currentUser);
  showToast('Streak Defended!', `🔥 Active streak progressed to ${currentUser.streak} day(s)! Keep it going.`, 'success');
  addCombatLog(`Daily check-in registered! Streak incremented to ${currentUser.streak}.`, 'system');
  updateDashboardUI(currentUser);
}

function resetCharacterStats() {
  if (confirm("🚨 WIPE ALL CHARACTER PROGRESS? This clears XP, levels, streak freezes, quests and items!")) {
    if (window.playSynthSound) window.playSynthSound('alert');

    currentUser.streak = 0;
    currentUser.xp = 0;
    currentUser.level = 1;
    currentUser.freezes = 3;
    currentUser.lastCheckIn = null;
    currentUser.unlockedBadges = [];
    currentUser.gold = 0;
    currentUser.hp = 100;
    currentUser.quests = [];
    currentUser.unlockedThemes = [];
    currentUser.activeTheme = 'default';
    currentUser.bossHp = 100;
    currentUser.bossMaxHp = 100;
    currentUser.bossLevel = 1;
    currentUser.focusHistory = [0, 0, 0, 0, 0, 0, 0];

    virtualTimeOffset = 0;
    localStorage.setItem('virtualTimeOffset', 0);

    saveUserState(currentUser);

    showToast('Character Wiped', 'Successfully reset all statistics.', 'info');
    logSimulation('Wiped character stats and reset offset clock back to 0.');
    updateDashboardUI(currentUser);
  }
}

// Helpers
function getSimulatedDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function calculateDaysDifference(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diff = d2 - d1;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// --- 8. DOM LISTENERS HOOK ---
document.addEventListener('DOMContentLoaded', async () => {
  const user = await window.checkSession('dashboard');
  if (!user) return;

  const savedOffset = localStorage.getItem('virtualTimeOffset');
  if (savedOffset) virtualTimeOffset = parseInt(savedOffset);

  updateDashboardUI(user);

  // Load persistent companion chat logs from MongoDB
  fetch(`/api/chats/${user.username}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.messages && data.messages.length > 0) {
        if (currentUser && currentUser.pet) {
          currentUser.pet.chatHistory = data.messages;
          renderPetChatBoxOnly(currentUser.pet);
        }
      } else {
        // If there are no persistent chat messages in MongoDB, initialize with a warm starting greeting!
        if (currentUser && currentUser.pet) {
          const pet = currentUser.pet;
          const name = pet.name;
          let greet = "";
          if (pet.type === 'Focus Cat') {
            greet = `Meow! Hello study master ${currentUser.username}! I am ${name}, your loyal study cat. Let's study hard together! Purr... Ask me any B.Tech revision doubt!`;
          } else if (pet.type === 'Zen Panda') {
            greet = `Greetings, peaceful scholar. I am ${name}. Together we shall walk the path of knowledge and absolute focus. What syllabus concepts can I explain for you today?`;
          } else if (pet.type === 'Knowledge Dragon') {
            greet = `GREETINGS, WARRIOR OF INTELLECT! I am ${name}, standard-bearer of the academic flame! Let us conquer the B.Tech syllabus together! Command me with your doubts!`;
          } else if (pet.type === 'Smart Fox') {
            greet = `Hey there, clever study coder! I'm ${name}, your quick hack expert. Ready to clear B.Tech exams with smart cheat codes? Shoot your doubts!`;
          } else if (pet.type === 'Chill Penguin') {
            greet = `Yo chill study buddy! I'm ${name}, your cool co-pilot. Let's make this study grind a total breeze. Ask me whatever tough engineering stuff is bugging you!`;
          } else if (pet.type === 'Pixel Robot') {
            greet = `SYSTEM STATE: INITIALIZED. Companion designation: ${name}. Core directive: process academic doubts, optimize B.Tech variables, and assist student. Awaiting query inputs.`;
          }
          
          pet.chatHistory = [{ sender: 'pet', text: greet }];
          renderPetChatBoxOnly(pet);
          
          // Proactively save this starting greeting to MongoDB so it persists immediately
          fetch('/api/chats/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: currentUser.username,
              sender: 'companion',
              text: greet
            })
          }).catch(err => console.warn('Chat greeting sync error:', err));
        }
      }
    })
    .catch(err => console.warn('Offline mock chat logs active:', err));

  // Evaluate streak locally on startup
  const now = new Date(Date.now() + virtualTimeOffset);
  evaluateStreakWindow(now);
  updateDashboardUI(currentUser);

  // Auto-open settings overlay from query parameters
  const params = new URLSearchParams(window.location.search);
  if (params.get('settings') === 'true') {
    window.toggleSettingsModal(true);
    const targetTab = params.get('tab');
    if (targetTab) {
      window.switchSettingsTab(targetTab);
    }
  }

  const rollDiceBtn = document.getElementById('roll-dice-btn');
  if (rollDiceBtn) rollDiceBtn.addEventListener('click', rollSyllabusDice);

  const startDuelBtn = document.getElementById('start-duel-test-btn');
  if (startDuelBtn) startDuelBtn.addEventListener('click', startSyllabusDuelTest);

  const rerollDiceBtn = document.getElementById('reroll-dice-btn');
  if (rerollDiceBtn) rerollDiceBtn.addEventListener('click', rerollSyllabusDice);

  const prevMcqBtn = document.getElementById('prev-mcq-btn');
  if (prevMcqBtn) prevMcqBtn.addEventListener('click', window.prevMcqQuestion);

  const nextMcqBtn = document.getElementById('next-mcq-btn');
  if (nextMcqBtn) nextMcqBtn.addEventListener('click', window.nextMcqQuestion);

  const submitMcqBtn = document.getElementById('submit-mcq-btn');
  if (submitMcqBtn) submitMcqBtn.addEventListener('click', submitSyllabusDuelTest);

  const finishDuelBtn = document.getElementById('finish-duel-btn');
  if (finishDuelBtn) finishDuelBtn.addEventListener('click', window.finishSyllabusDuel);

  const skipDuelBtn = document.getElementById('sim-skip-duel-btn');
  if (skipDuelBtn) skipDuelBtn.addEventListener('click', window.warpDuelTimer);

  const startTimerBtn = document.getElementById('timer-start-btn');
  if (startTimerBtn) startTimerBtn.addEventListener('click', window.startTimer);

  const pauseTimerBtn = document.getElementById('timer-pause-btn');
  if (pauseTimerBtn) pauseTimerBtn.addEventListener('click', window.pauseTimer);

  const resetTimerBtn = document.getElementById('timer-reset-btn');
  if (resetTimerBtn) resetTimerBtn.addEventListener('click', window.resetTimer);

  const customDurInput = document.getElementById('custom-duration-input');
  if (customDurInput) {
    customDurInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0 && timerMode === 'focus' && timerState === 'idle') {
        timerTimeLeft = val * 60;
        timerTotalDuration = val * 60;
        const display = document.getElementById('timer-time');
        if (display) {
          const m = Math.floor(timerTimeLeft / 60);
          const s = timerTimeLeft % 60;
          display.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        updateTimerCircleProgress();
      }
    });
  }

  const sSelect = document.getElementById('soundscape-select');
  if (sSelect) sSelect.addEventListener('change', window.handleSoundscapeChange);

  const buyFreeze = document.getElementById('buy-freeze-btn');
  if (buyFreeze) buyFreeze.addEventListener('click', () => buyShopItem('freeze', 75));

  const buyDefault = document.getElementById('buy-theme-default-btn');
  if (buyDefault) buyDefault.addEventListener('click', () => buyShopItem('theme-default', 0));

  const buyCyber = document.getElementById('buy-theme-cyber-btn');
  if (buyCyber) buyCyber.addEventListener('click', () => buyShopItem('theme-cyber', 100));

  const buyForest = document.getElementById('buy-theme-forest-btn');
  if (buyForest) buyForest.addEventListener('click', () => buyShopItem('theme-forest', 150));

  const buySolar = document.getElementById('buy-theme-solar-btn');
  if (buySolar) buySolar.addEventListener('click', () => buyShopItem('theme-solar', 200));

  const qForm = document.getElementById('quest-spawn-form');
  if (qForm) qForm.addEventListener('submit', spawnQuest);

  const checkIn = document.getElementById('check-in-btn');
  if (checkIn) checkIn.addEventListener('click', performDailyCheckIn);

  const themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (window.playSynthSound) window.playSynthSound('click');
      const body = document.body;
      const isDark = body.classList.contains('dark-theme');

      body.classList.toggle('dark-theme', !isDark);
      body.classList.toggle('light-theme', isDark);
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

    const savedVisual = localStorage.getItem('theme');
    if (savedVisual === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  }

  const simDay = document.getElementById('sim-day-btn');
  if (simDay) simDay.addEventListener('click', simulateNextDay);

  const simWarpTime = document.getElementById('sim-skip-timer-btn');
  if (simWarpTime) simWarpTime.addEventListener('click', window.warpPomodoroTimer);

  const simReset = document.getElementById('reset-all-btn');
  if (simReset) simReset.addEventListener('click', resetCharacterStats);
});

// ==========================================
// GROUP PEER STUDY ROOM - WEBRTC & WEB CAMERA HOOKS
// ==========================================
let localMediaStream = null;
let micEnabled = true;
let camEnabled = false;

window.hostStudyRoom = function () {
  if (window.playSynthSound) window.playSynthSound('click');
  const randomCode = 'ST-' + Math.floor(100 + Math.random() * 900);
  document.getElementById('active-room-title').innerText = `Room: ${randomCode}`;

  // Transition views
  document.getElementById('room-lobby-state').classList.add('hidden');
  document.getElementById('room-active-state').classList.remove('hidden');

  showToast('Study Room Created!', `Invited peer group code: ${randomCode}`, 'success');
  addCombatLog(`🎥 Started Group Study Room session: ${randomCode}`, 'system');
};

window.joinStudyRoom = function () {
  const codeInput = document.getElementById('room-code-input');
  const code = codeInput.value.trim().toUpperCase();

  if (!code) {
    showToast('Enter Code', 'Please input a valid room code!', 'alert');
    return;
  }

  if (window.playSynthSound) window.playSynthSound('click');
  document.getElementById('active-room-title').innerText = `Room: ${code}`;

  // Transition views
  document.getElementById('room-lobby-state').classList.add('hidden');
  document.getElementById('room-active-state').classList.remove('hidden');

  showToast('Connected!', `Joined study room: ${code}`, 'success');
  addCombatLog(`🎥 Joined Group Study Room: ${code}`, 'system');
};

window.copyRoomCode = function () {
  const title = document.getElementById('active-room-title').innerText;
  const code = title.split('Room: ')[1] || 'ST-100';

  navigator.clipboard.writeText(code).then(() => {
    showToast('Code Copied!', `Room code ${code} copied to clipboard!`, 'info');
  }).catch(() => {
    alert(`Invite Code: ${code}`);
  });
};

window.toggleLocalMic = function () {
  micEnabled = !micEnabled;
  if (window.playSynthSound) window.playSynthSound('click');

  const btn = document.getElementById('toggle-mic-btn');
  const badge = document.getElementById('local-mic-badge');

  if (micEnabled) {
    btn.className = "btn btn-outline btn-circle btn-sm active-mic";
    btn.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
    if (badge) {
      badge.className = "mic-status-badge";
      badge.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
    }
    showToast('Mic Unmuted', 'Microphone audio capture active.', 'info');
  } else {
    btn.className = "btn btn-outline btn-circle btn-sm disabled-mic";
    btn.innerHTML = `<i class="fa-solid fa-microphone-slash" style="color: var(--danger-color);"></i>`;
    if (badge) {
      badge.className = "mic-status-badge muted";
      badge.innerHTML = `<i class="fa-solid fa-microphone-slash" style="color: var(--danger-color);"></i>`;
    }
    showToast('Mic Muted', 'Microphone audio capture disabled.', 'info');
  }

  // Toggle audio track if stream exists
  if (localMediaStream) {
    localMediaStream.getAudioTracks().forEach(track => {
      track.enabled = micEnabled;
    });
  }
};

window.toggleLocalCam = function () {
  camEnabled = !camEnabled;
  if (window.playSynthSound) window.playSynthSound('click');

  const btn = document.getElementById('toggle-cam-btn');
  const videoEl = document.getElementById('room-local-video');
  const placeholder = document.getElementById('local-video-placeholder');

  if (camEnabled) {
    btn.className = "btn btn-outline btn-circle btn-sm active-cam";
    btn.innerHTML = `<i class="fa-solid fa-video"></i>`;

    // Attempt camera track capture
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localMediaStream = stream;

        // Disable audio track if currently muted in controls
        stream.getAudioTracks().forEach(track => {
          track.enabled = micEnabled;
        });

        if (videoEl) {
          videoEl.srcObject = stream;
          videoEl.classList.remove('hidden');
        }
        if (placeholder) placeholder.classList.add('hidden');
        showToast('Camera Connected', 'Active video broadcast streaming.', 'success');
      })
      .catch(err => {
        console.warn('Camera access blocked or not found: ', err);
        camEnabled = false;
        btn.className = "btn btn-outline btn-circle btn-sm disabled-cam";
        btn.innerHTML = `<i class="fa-solid fa-video-slash"></i>`;
        showToast('Camera Access Blocked', 'Could not open video stream. Verify camera permissions!', 'alert');
      });
  } else {
    btn.className = "btn btn-outline btn-circle btn-sm disabled-cam";
    btn.innerHTML = `<i class="fa-solid fa-video-slash"></i>`;

    // Stop local video tracks
    if (localMediaStream) {
      localMediaStream.getVideoTracks().forEach(track => track.stop());
    }
    if (videoEl) {
      videoEl.srcObject = null;
      videoEl.classList.add('hidden');
    }
    if (placeholder) placeholder.classList.remove('hidden');
    showToast('Camera Disconnected', 'Video feed closed.', 'info');
  }
};

window.leaveStudyRoom = function () {
  if (window.playSynthSound) window.playSynthSound('click');

  // Stop all camera/mic tracks
  if (localMediaStream) {
    localMediaStream.getTracks().forEach(track => track.stop());
    localMediaStream = null;
  }

  // Reset buttons
  micEnabled = true;
  camEnabled = false;

  const micBtn = document.getElementById('toggle-mic-btn');
  if (micBtn) {
    micBtn.className = "btn btn-outline btn-circle btn-sm active-mic";
    micBtn.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
  }

  const camBtn = document.getElementById('toggle-cam-btn');
  if (camBtn) {
    camBtn.className = "btn btn-outline btn-circle btn-sm disabled-cam";
    camBtn.innerHTML = `<i class="fa-solid fa-video-slash"></i>`;
  }

  const videoEl = document.getElementById('room-local-video');
  if (videoEl) {
    videoEl.srcObject = null;
    videoEl.classList.add('hidden');
  }

  const placeholder = document.getElementById('local-video-placeholder');
  if (placeholder) placeholder.classList.remove('hidden');

  // Transition views
  document.getElementById('room-active-state').classList.add('hidden');
  document.getElementById('room-lobby-state').classList.remove('hidden');

  showToast('Room Disconnected', 'You have left the study room.', 'info');
  addCombatLog('🎥 Left Group Study Room.', 'system');
};

// ==========================================
// PHASE 2: AI STUDY COMPANION PET CONTROLLER
// ==========================================
let selectedAdoptPetType = null;

window.selectAdoptPet = function (petType, cardEl) {
  if (window.playSynthSound) window.playSynthSound('click');
  selectedAdoptPetType = petType;

  // Remove selected class from all cards
  const cards = document.querySelectorAll('.pet-choice-card');
  cards.forEach(c => c.classList.remove('selected'));

  // Add selected class to chosen card
  cardEl.classList.add('selected');
};

window.confirmPetAdoption = function () {
  if (!currentUser) return;

  const nameInput = document.getElementById('adopt-pet-name-input');
  const petName = nameInput ? nameInput.value.trim() : '';

  if (!selectedAdoptPetType) {
    showToast('Choose a Companion', 'Please select a companion from the choices above!', 'alert');
    return;
  }
  if (petName === '') {
    showToast('Name Required', 'Please give your study companion a name!', 'alert');
    return;
  }

  // Initialize pet state
  const pet = {
    name: petName,
    type: selectedAdoptPetType,
    hp: 100,
    maxHp: 100,
    happiness: 100,
    xp: 0,
    level: 1,
    mood: "Energetic",
    lastFed: new Date().toISOString(),
    lastPlayed: new Date().toISOString(),
    chatHistory: []
  };

  // Initial personal greeting log
  let greet = "";
  if (selectedAdoptPetType === 'Focus Cat') {
    greet = `Meow! Hello study master ${currentUser.username}! I am ${petName}, your loyal study cat. Let's study hard together! Purr... Ask me any B.Tech revision doubt!`;
  } else if (selectedAdoptPetType === 'Zen Panda') {
    greet = `Greetings, peaceful scholar. I am ${petName}. Together we shall walk the path of knowledge and absolute focus. What syllabus concepts can I explain for you today?`;
  } else if (selectedAdoptPetType === 'Knowledge Dragon') {
    greet = `GREETINGS, WARRIOR OF INTELLECT! I am ${petName}, standard-bearer of the academic flame! Let us conquer the B.Tech syllabus together! Command me with your doubts!`;
  } else if (selectedAdoptPetType === 'Smart Fox') {
    greet = `Hey there, clever study coder! I'm ${petName}, your quick hack expert. Ready to clear B.Tech exams with smart cheat codes? Shoot your doubts!`;
  } else if (selectedAdoptPetType === 'Chill Penguin') {
    greet = `Yo chill study buddy! I'm ${petName}, your cool co-pilot. Let's make this study grind a total breeze. Ask me whatever tough engineering stuff is bugging you!`;
  } else if (selectedAdoptPetType === 'Pixel Robot') {
    greet = `SYSTEM STATE: INITIALIZED. Companion designation: ${petName}. Core directive: process academic doubts, optimize B.Tech variables, and assist student. Awaiting query inputs.`;
  }

  pet.chatHistory.push({ sender: 'pet', text: greet });

  currentUser.pet = pet;
  saveUserState(currentUser);

  if (window.playSynthSound) window.playSynthSound('unlock');
  showToast('Companion Adopted!', `Congratulations! ${petName} is now bound to your focus desk!`, 'success');
  addCombatLog(`💖 Adopted study companion: ${petName} the ${selectedAdoptPetType}.`, 'system');

  // Hide modal and refresh UI
  const adoptionModal = document.getElementById('pet-adoption-modal');
  if (adoptionModal) adoptionModal.classList.add('hidden');

  updateDashboardUI(currentUser);
};

window.feedCompanionPet = function () {
  if (!currentUser || !currentUser.pet) return;
  const pet = currentUser.pet;

  if (pet.hp <= 0) {
    showToast('Companion Unconscious', 'Your companion has fainted! You must revive them using an elixir or complete a Pomodoro focus session first.', 'alert');
    return;
  }
  if (currentUser.gold < 15) {
    showToast('Insufficient GP', 'Feeding your study companion costs 15 GP!', 'alert');
    return;
  }

  currentUser.gold -= 15;
  pet.hp = Math.min(100, pet.hp + 20);
  pet.happiness = Math.min(100, pet.happiness + 10);
  pet.lastFed = new Date().toISOString();

  let reaction = "Meow! Yummy study snack! Heals my tummy! Meow!";
  if (pet.type === 'Zen Panda') reaction = "Ah, delightful nourishment. Nature provides, and my mind feels serene.";
  else if (pet.type === 'Knowledge Dragon') reaction = "A BOUNTIFUL OFFERING! My internal academic furnace burns brighter now! Thank you, master!";
  else if (pet.type === 'Smart Fox') reaction = "Aha! Nutritious fuel! My logical gears are running at double speed now!";
  else if (pet.type === 'Chill Penguin') reaction = "Ah, sweet brain freeze snacks. Tastes totally amazing, buddy!";
  else if (pet.type === 'Pixel Robot') reaction = "ENERGY CORE STATUS: BOOSTED. Resource intake processed. Recharging biological circuits.";

  pet.chatHistory.push({ sender: 'user', text: "Here is a tasty study snack! Eat up!" });
  pet.chatHistory.push({ sender: 'pet', text: reaction });
  while (pet.chatHistory.length > 25) pet.chatHistory.shift();

  if (window.playSynthSound) window.playSynthSound('success');
  saveUserState(currentUser);
  showToast('Companion Fed!', `Fed ${pet.name}. HP and Happiness restored.`, 'success');
  addCombatLog(`🍪 Fed companion ${pet.name}. Deducted 15 GP.`, 'system');
  updateDashboardUI(currentUser);
};

window.playCompanionPet = function () {
  if (!currentUser || !currentUser.pet) return;
  const pet = currentUser.pet;

  if (pet.hp <= 0) {
    showToast('Companion Unconscious', 'Your companion has fainted! Revive them first to play.', 'alert');
    return;
  }
  if (currentUser.gold < 10) {
    showToast('Insufficient GP', 'Playing with your study companion costs 10 GP!', 'alert');
    return;
  }

  currentUser.gold -= 10;
  pet.happiness = Math.min(100, pet.happiness + 25);
  pet.xp += 15;
  pet.lastPlayed = new Date().toISOString();

  let reaction = "Purr... That game was so fun, meow! I feel so happy!";
  if (pet.type === 'Zen Panda') reaction = "Playfulness is the quiet dance of the soul. Bao feels peaceful.";
  else if (pet.type === 'Knowledge Dragon') reaction = "ROAR! A thrilling duel of wits! Ignis is deeply pleased!";
  else if (pet.type === 'Smart Fox') reaction = "Haha! Cunning quick-moves! You can't catch me! My logical brain feels refreshed!";
  else if (pet.type === 'Chill Penguin') reaction = "Totally cool game session, buddy. Let's slide down the glaciers!";
  else if (pet.type === 'Pixel Robot') reaction = "ENTERTAINMENT SUBROUTINE: COMPLETED. Logic grids optimized. Happiness value incremented by 25.";

  pet.chatHistory.push({ sender: 'user', text: "Let's take a break and play a game!" });
  pet.chatHistory.push({ sender: 'pet', text: reaction });
  while (pet.chatHistory.length > 25) pet.chatHistory.shift();

  // Level check
  let petXpNeeded = pet.level * 100;
  while (pet.xp >= petXpNeeded) {
    pet.xp -= petXpNeeded;
    pet.level++;
    petXpNeeded = pet.level * 100;
    showToast('Companion Leveled Up!', `${pet.name} reached Level ${pet.level}!`, 'level');
    addCombatLog(`🌟 Companion ${pet.name} leveled up to Level ${pet.level}!`, 'system');
  }

  if (window.playSynthSound) window.playSynthSound('success');
  saveUserState(currentUser);
  showToast('Played!', `Played with ${pet.name}. Happiness and XP boosted.`, 'success');
  addCombatLog(`🎮 Played with companion ${pet.name}. Deducted 10 GP.`, 'system');
  updateDashboardUI(currentUser);
};

window.reviveCompanionPet = function () {
  if (!currentUser || !currentUser.pet) return;
  const pet = currentUser.pet;

  if (pet.hp > 0) return;
  if (currentUser.gold < 100) {
    showToast('Insufficient GP', 'Reviving your companion with an Elixir costs 100 GP!', 'alert');
    return;
  }

  currentUser.gold -= 100;
  pet.hp = 50;
  pet.happiness = 50;

  let reaction = "Meow... *yawns* I had a dark sleep. Thank you for reviving me, master! Let's stay consistent, purr!";
  if (pet.type === 'Zen Panda') reaction = "Breathe in... The storm has cleared. Bao has returned to the peaceful garden. Let us walk in focus.";
  else if (pet.type === 'Knowledge Dragon') reaction = "THE ACADEMIC FIRE REIGNITES! Ignis has risen from the ashes! Command me, master!";
  else if (pet.type === 'Smart Fox') reaction = "System reboot successful! Sly is back in the game! Thanks for the revive!";
  else if (pet.type === 'Chill Penguin') reaction = "Whoa, that was a close freeze. Thanks for thawing me out, buddy!";
  else if (pet.type === 'Pixel Robot') reaction = "SYS_REBOOT_SUCCESSFUL. Main power grids online. Battery capacity at 50%. Awaiting directives.";

  pet.chatHistory.push({ sender: 'user', text: "Here is an Elixir of Life! Arise, companion!" });
  pet.chatHistory.push({ sender: 'pet', text: reaction });
  while (pet.chatHistory.length > 25) pet.chatHistory.shift();

  if (window.playSynthSound) window.playSynthSound('unlock');
  saveUserState(currentUser);
  showToast('Companion Revived!', `${pet.name} has been restored to life!`, 'success');
  addCombatLog(`✨ Revived fainted companion ${pet.name}. Deducted 100 GP.`, 'system');
  updateDashboardUI(currentUser);
};

window.handlePetChatKeydown = function (e) {
  if (e.key === 'Enter') {
    window.sendPetChatMessage();
  }
};

window.sendPetChatMessage = function () {
  if (!currentUser || !currentUser.pet) return;
  const pet = currentUser.pet;

  const inputEl = document.getElementById('pet-chat-input');
  const query = inputEl ? inputEl.value.trim() : '';

  // Guard against sending absolutely nothing
  if (query === '' && !pendingChatAttachment) return;

  if (pet.hp <= 0) {
    showToast('Companion Unconscious', 'Your fainted companion cannot process academic doubts. Revive them first!', 'alert');
    return;
  }

  // Store pending attachment details
  let attachedImgData = null;
  let attachedImgMime = null;
  let attachedImgUrl = null;
  let attachedImgName = null;

  if (pendingChatAttachment) {
    attachedImgData = pendingChatAttachment.data;
    attachedImgMime = pendingChatAttachment.mimeType;
    attachedImgUrl = pendingChatAttachment.dataUrl;
    attachedImgName = pendingChatAttachment.name;

    // Clear preview visually
    window.clearPetChatAttachment();
  }

  // Print User Bubble (store prompt & attachment url)
  const chatLog = { sender: 'user', text: query };
  if (attachedImgUrl) chatLog.image = attachedImgUrl;

  if (!pet.chatHistory) pet.chatHistory = [];
  pet.chatHistory.push(chatLog);
  if (inputEl) inputEl.value = '';

  renderPetChatBoxOnly(pet);

  // POST user message to MongoDB Chat History securely
  fetch('/api/chats/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: currentUser.username,
      sender: 'user',
      text: query,
      imageUrl: attachedImgUrl
    })
  })
    .catch(err => console.warn('Chat sync error:', err));

  // Display Thinking Indicator
  const chatBox = document.getElementById('pet-chat-box');
  const thinkingId = 'think_' + Date.now();
  if (chatBox) {
    chatBox.innerHTML += `
      <div id="${thinkingId}" class="chat-bubble pet-bubble" style="font-style:italic;">
        <i class="fa-solid fa-circle-notch fa-spin"></i> ${pet.name} is thinking...
      </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  let brainMode = localStorage.getItem('ss_gemini_brain_mode') || 'persona';
  const apiKey = (localStorage.getItem('ss_gemini_api_key') || '').trim();

  // Fail-safe auto upgrade: if a valid API key is present, automatically enable Live Gemini Brain!
  if (apiKey !== '' && brainMode === 'persona') {
    brainMode = 'gemini';
    localStorage.setItem('ss_gemini_brain_mode', 'gemini');
  }

  if (brainMode === 'gemini' && apiKey !== '') {
    // Mode A: Google Gemini Real AI Brain API Connection
    const systemPrompt = getPetSystemPrompt(pet.type, pet.name);
    const contents = [];
    const parts = [
      { text: `${systemPrompt}\n\nUser Prompt: ${query || "Please analyze this uploaded visual concept/question image."}` }
    ];

    if (attachedImgData) {
      parts.push({
        inlineData: {
          mimeType: attachedImgMime,
          data: attachedImgData
        }
      });
    }

    contents.push({ parts });

    const makeGeminiFetch = (modelName) => {
      return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });
    };

    makeGeminiFetch('gemini-2.5-flash')
      .then(async res => {
        if (res.status === 503 || res.status === 429 || !res.ok) {
          console.warn(`Primary model gemini-2.5-flash status ${res.status}. Trying fallback model gemini-1.5-flash...`);
          const fallbackRes = await makeGeminiFetch('gemini-1.5-flash');
          const fallbackData = await fallbackRes.json();
          if (!fallbackRes.ok) {
            const errMsg = fallbackData.error ? fallbackData.error.message : `HTTP status ${fallbackRes.status}`;
            throw new Error(errMsg);
          }
          return fallbackData;
        }
        return await res.json();
      })
      .then(data => {
        // Remove thinking indicator
        const thinkingEl = document.getElementById(thinkingId);
        if (thinkingEl) thinkingEl.remove();

        let answer = "";
        if (data.error) {
          answer = getPetApiErrorMsg(pet.type, pet.name, data.error.message);
        } else {
          try {
            answer = data.candidates[0].content.parts[0].text;
          } catch (err) {
            answer = getPetApiErrorMsg(pet.type, pet.name, "Invalid response payload from API");
          }
        }

        pet.chatHistory.push({ sender: 'pet', text: answer });
        while (pet.chatHistory.length > 25) pet.chatHistory.shift();

        saveUserState(currentUser);
        renderPetChatBoxOnly(pet);

        // POST companion response to MongoDB Chat History
        fetch('/api/chats/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            sender: 'companion',
            text: answer
          })
        })
          .catch(err => console.warn('Chat sync error:', err));

        if (window.playSynthSound) window.playSynthSound('success');
      })
      .catch(err => {
        console.warn('Gemini API Fetch failed: ', err);

        // Remove thinking indicator
        const thinkingEl = document.getElementById(thinkingId);
        if (thinkingEl) thinkingEl.remove();

        const errorMsgText = err.message || "Network request failed";
        const answer = getPetApiErrorMsg(pet.type, pet.name, errorMsgText);

        pet.chatHistory.push({ sender: 'pet', text: answer });
        while (pet.chatHistory.length > 25) pet.chatHistory.shift();

        saveUserState(currentUser);
        renderPetChatBoxOnly(pet);

        // POST companion response to MongoDB Chat History
        fetch('/api/chats/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            sender: 'companion',
            text: answer
          })
        })
          .catch(err => console.warn('Chat sync error:', err));

        showToast('API Connection Error', errorMsgText, 'alert');
        if (window.playSynthSound) window.playSynthSound('click');
      });

  } else {
    // Mode B: Smart Local Heuristics
    setTimeout(() => {
      const thinkingEl = document.getElementById(thinkingId);
      if (thinkingEl) thinkingEl.remove();

      const answer = getLocalSmartFallback(pet.type, query, attachedImgName);

      pet.chatHistory.push({ sender: 'pet', text: answer });
      while (pet.chatHistory.length > 25) pet.chatHistory.shift();

      saveUserState(currentUser);
      renderPetChatBoxOnly(pet);

      // POST companion response to MongoDB Chat History
      fetch('/api/chats/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          sender: 'companion',
          text: answer
        })
      })
        .catch(err => console.warn('Chat sync error:', err));

      if (window.playSynthSound) window.playSynthSound('click');
    }, 1000);
  }
};

function renderPetChatBoxOnly(pet) {
  const chatBox = document.getElementById('pet-chat-box');
  if (!chatBox) return;

  chatBox.innerHTML = '';
  const history = pet.chatHistory || [];

  history.forEach(chat => {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${chat.sender === 'user' ? 'user-bubble' : 'pet-bubble'}`;

    if (chat.image) {
      const imgEl = document.createElement('img');
      imgEl.src = chat.image;
      imgEl.style.maxWidth = "100%";
      imgEl.style.maxHeight = "120px";
      imgEl.style.borderRadius = "8px";
      imgEl.style.marginBottom = "6px";
      imgEl.style.display = "block";
      imgEl.style.cursor = "zoom-in";
      imgEl.onclick = function () {
        // Modal zoom view!
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.85)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '99999';
        overlay.style.cursor = 'zoom-out';

        const largeImg = document.createElement('img');
        largeImg.src = chat.image;
        largeImg.style.maxWidth = '90%';
        largeImg.style.maxHeight = '90%';
        largeImg.style.borderRadius = '8px';
        largeImg.style.border = '2px solid rgba(255,255,255,0.1)';

        overlay.appendChild(largeImg);
        overlay.onclick = () => overlay.remove();
        document.body.appendChild(overlay);
      };
      bubble.appendChild(imgEl);
    }

    const txtEl = document.createElement('div');
    txtEl.innerText = chat.text;
    bubble.appendChild(txtEl);

    chatBox.appendChild(bubble);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

function getPetDoubtResponse(type, query) {
  const q = query.toLowerCase();

  // 1. Quantum Mechanics trigger
  if (q.includes('quantum') || q.includes('schrodinger') || q.includes('schrödinger') || q.includes('uncertainty') || q.includes('box') || q.includes('wave function')) {
    if (type === 'Focus Cat') {
      return "Meow! Quantum mechanics tells us everything is a wave function of probability Ψ. Erwin Schrödinger constructed his famous wave equation iℏ(∂/∂t)Ψ = HΨ to compute allowed energy levels in a 1D box. And Werner Heisenberg showed we can't measure position and momentum at the same time! Clowder rules say if I'm in a box, I'm both awake and asleep until you open it! Purr...";
    } else if (type === 'Zen Panda') {
      return "Ah, look at the wave function, my child. It represents the quiet probability of finding a particle in the vast universe, governed by the sacred Schrödinger equation. Just as you cannot measure the exact path of a falling leaf and its speed at once—as Werner Heisenberg taught us—you must accept the beautiful uncertainty of existence...";
    } else if (type === 'Knowledge Dragon') {
      return "BEHOLD! Quantum mechanics is the ultimate code of the cosmos! The wave function Ψ represents probability amplitudes. Its absolute square |Ψ|² yields probability density! Under the Schrödinger equation, a particle in an infinite 1D potential box of width L has quantized energy E = n²h² / (8mL²)! Marvel at the precision of the physical laws! Roar!";
    } else if (type === 'Smart Fox') {
      return "Aha! Quick quantum hack: Schrödinger's equation is just energy conservation in complex form. In a 1D box of length L, the energy levels go up by n²—that's a quadratic scale! And Heisenberg's uncertainty is simple: Δx · Δp ≥ ℏ/2. You can't cheat both at once, so focus on one subject at a time! *wink*";
    } else if (type === 'Chill Penguin') {
      return "Yo, quantum stuff is chill. Basically, Schrödinger's equation tells you where a particle's slacking off in the universe. If you trap it in a 1D box of width L, its energy vibes are totally locked at n²h² / 8mL². No biggie, just stay cool and don't let Heisenberg measure your chill flow...";
    } else if (type === 'Pixel Robot') {
      return "INITIATING QUANTUM LOGIC SUBROUTINE. Quantum wave function Ψ maps state vectors. Schrödinger's time-dependent partial differential equation computes potential barriers. Wave-particle duality verified. Heisenberg Uncertainty Principle verified: margin of error ≥ ℏ/2. Quantized energy levels locked in 1D box boundary conditions.";
    }
  }

  // 2. Malloc / Pointers trigger
  if (q.includes('malloc') || q.includes('free') || q.includes('pointer') || q.includes('memory leak') || q.includes('stack') || q.includes('heap')) {
    if (type === 'Focus Cat') {
      return "Malloc! That stands for memory allocation, meow! It requests a block of bytes from the system heap and returns a void pointer. Remember to always run free(p) to return that heap block, or else you will cause a memory leak! We cats hate leaks—they spoil our sleeping rugs. Purr...";
    } else if (type === 'Zen Panda') {
      return "To allocate memory is to request a peaceful space in the grand garden of the Heap. malloc(size) returns a pointer—a path to that space. But beware of greed; if you do not release it back to nature using free(pointer), you create a leak, clogging the flow of your program's life...";
    } else if (type === 'Knowledge Dragon') {
      return "HEAR MY WORDS! malloc() is the grand summons for dynamic memory from the high heap! It returns a void pointer void* which must be cast to your target type. Pointer arithmetic allows you to traverse sequential arrays by increments of sizeof(type). But heed this warning: fail to call free() and a catastrophic Memory Leak will ravage your system's reserves!";
    } else if (type === 'Smart Fox') {
      return "Here's the memory shortcut: malloc(size) grabs bytes on the heap. Pointers are just numeric addresses—variables holding maps to those cells. Pointer arithmetic adds increments based on the data type's size. Avoid memory leaks by pairing every single malloc with a free—it's the golden rule of C! *tails wag*";
    } else if (type === 'Chill Penguin') {
      return "malloc is like renting a chill study room on the heap, bro. It hands you a pointer key. If you're doing pointer arithmetic, you're just sliding down the index hall. But dude, don't be a slacker—when you're done, call free() or you'll leak memory and crash the whole vibe...";
    } else if (type === 'Pixel Robot') {
      return "SYSTEM MEMORY SUBROUTINE. Function malloc(size_t) allocates dynamic memory block on system heap. Returns pointer of type void* referencing initial byte address. Pointer arithmetic calculates offset based on sizeof(type) scale. Safety warning: unreleased allocations cause memory leak defects. Execute free(p) instruction.";
    }
  }

  // 3. Kirchhoff / Circuits trigger
  if (q.includes('kirchhoff') || q.includes('thevenin') || q.includes('thevenin') || q.includes('norton') || q.includes('kcl') || q.includes('kvl') || q.includes('circuit')) {
    if (type === 'Focus Cat') {
      return "Kirchhoff! Kirchhoff's Current Law KCL says the sum of currents entering a node equals the sum leaving—just like water in a pipe, meow! Thevenin's theorem simplifies a complex bilateral linear network into a single voltage source Vth in series with Rth! Easy like catching mice...";
    } else if (type === 'Zen Panda') {
      return "Kirchhoff's laws remind us of the great balances. What flows into a junction must flow out—this is KCL, a state of perfect harmony. Thevenin's theorem teaches us that no matter how complex the storms of circuits are, they can always be simplified into a single calm source of voltage and a single path of resistance...";
    } else if (type === 'Knowledge Dragon') {
      return "UNLEASH THE CURRENT! Kirchhoff's Voltage Law KVL declares that the algebraic sum of all potential differences in any closed loop must equal zero! KCL is the ironclad law of conservation of charge! Thevenin's theorem simplifies any linear network into an equivalent Vth and Rth! Harness this power to dominate your circuit exams!";
    } else if (type === 'Smart Fox') {
      return "Circuit hack: KCL is just node balance (inputs = outputs). KVL is loop balance (net drop = 0). Thevenin's theorem lets you replace a massive network with just one voltage source Vth and series resistor Rth. Solve for Voc to get Vth, and Rth by shutting down all active sources! *quick calculations*";
    } else if (type === 'Chill Penguin') {
      return "Okay, Kirchhoff's current law KCL is like a party—everyone coming in has to leave eventually, keep the node chill. Thevenin's theorem is super neat; it takes a crazy tangled wire mesh and turns it into just one voltage source and one resistor. Less stress, cool current flow...";
    } else if (type === 'Pixel Robot') {
      return "ELECTRICAL NETWORK LOGIC. KCL: sum(I_in) = sum(I_out) (conservation of charge). KVL: sum(V) = 0 in a closed loop (conservation of energy). Thevenin transformation computes open-circuit voltage Voc = Vth and short-circuit current to resolve Norton equivalent circuit: Ino = Vth / Rth.";
    }
  }

  // 4. Thermodynamics / Fluids trigger
  if (q.includes('carnot') || q.includes('entropy') || q.includes('second law') || q.includes('viscosity') || q.includes('thermodynamic')) {
    if (type === 'Focus Cat') {
      return "Carnot! Nicolas Carnot designed the perfect heat engine cycle with two isothermal and two adiabatic processes, meow! The second law of thermodynamics tells us entropy always increases in an isolated system—things naturally get untidy, like my ball of yarn! Purr...";
    } else if (type === 'Zen Panda') {
      return "Entropy is the natural drift towards autumn, the inevitable scattering of leaves in a closed forest. The Carnot cycle represents the beautiful, unreachable ideal of complete efficiency. Just as water has viscosity—a quiet friction to its flow—every transition in life meets gentle resistance...";
    } else if (type === 'Knowledge Dragon') {
      return "THERMAL POWER! Nicolas Carnot's ideal cycle represents the thermodynamic limit of efficiency: efficiency = 1 - Tc/Th! The Second Law dictates that the entropy of the universe S must continually rise! Viscosity is the fluid's internal friction, resisting shear deformation! Nothing escapes the thermal laws! Roar!";
    } else if (type === 'Smart Fox') {
      return "Quick thermodynamics shortcut: Carnot efficiency depends only on absolute temperatures Tc and Th, not the working substance! Entropy is just a measurement of system disorder. Viscosity is fluid thickness—resistance to flow. Remember: high temperature means fast particles, keep your thermal variables in order!";
    } else if (type === 'Chill Penguin') {
      return "Carnot is the ultimate chill engine. It has two hot isothermal steps and two cool adiabatic steps. The efficiency is efficiency = 1 - Tc/Th—can't get better than that, dude. Viscosity is just thick fluid vibes, like pouring cold maple syrup. Keep it flowing smooth...";
    } else if (type === 'Pixel Robot') {
      return "THERMODYNAMICS PROCESSING UNIT. Carnot cycle efficiency: efficiency = 1 - (T_cold / T_hot). Isothermal expansion, adiabatic expansion, isothermal compression, adiabatic compression. Entropy dS = dQ/T >= 0 (Second Law verified). Viscosity coefficient mu maps shear stress: tau = mu * (du/dy).";
    }
  }

  // General fallback replies by personality
  if (type === 'Focus Cat') {
    return "Meow! That's a curious B.Tech topic. I suggest you open your study planner and do a 25-minute Pomodoro focus session on it! My health is looking great when you are studying, meow! Purr...";
  } else if (type === 'Zen Panda') {
    return "The river of B.Tech concepts flows wide, my child. Do not rush to cross it. Breathe in, establish your daily consistency checks, and the answers will unfold in calm focus.";
  } else if (type === 'Knowledge Dragon') {
    return "HARK! That concept requires deep academic dedication! Command the smart syllabus dice randomizer to test your steel, or add it as a legendary quest on your goal planner! Roar!";
  } else if (type === 'Smart Fox') {
    return "Oho! That's a tricky one. My recommendation? Break it down into standard visual cards, use mnemonics to log it in your memory, and take a quick check-in to boost our GP gold balance! *tails wag*";
  } else if (type === 'Chill Penguin') {
    return "Yo, no worries about that theory, buddy. Let's just lock down a solid study block on your study desk, earn some GP, and keep the chill vibes going. We got this!";
  } else {
    return "INPUT NOT RECOGNIZED IN ACADEMIC DICTIONARY. Recommendation: execute standard Pomodoro focus loop, restore focus energy points (HP), and maintain character levels.";
  }
}

function renderStudyPetUI(pet) {
  const displayCard = document.getElementById('study-pet-card');
  if (!displayCard) return;

  // Display stats
  document.getElementById('pet-display-name').innerText = `${pet.name} the ${pet.type}`;
  document.getElementById('pet-display-level').innerText = `Companion Level ${pet.level}`;

  // Mood badge
  const moodTag = document.getElementById('pet-mood-tag');
  if (moodTag) {
    if (pet.hp <= 0) {
      moodTag.innerText = "💀 Unconscious";
      moodTag.className = "pet-mood-badge";
      moodTag.style.background = "rgba(239,68,68,0.12)";
      moodTag.style.color = "#f87171";
      moodTag.style.borderColor = "rgba(239,68,68,0.25)";
    } else if (pet.hp <= 30) {
      moodTag.innerText = "🤢 Sick";
      moodTag.className = "pet-mood-badge";
      moodTag.style.background = "rgba(245,158,11,0.12)";
      moodTag.style.color = "#fbbf24";
      moodTag.style.borderColor = "rgba(245,158,11,0.25)";
    } else if (pet.happiness <= 40) {
      moodTag.innerText = "😢 Lonely";
      moodTag.className = "pet-mood-badge";
      moodTag.style.background = "rgba(59,130,246,0.12)";
      moodTag.style.color = "#60a5fa";
      moodTag.style.borderColor = "rgba(59,130,246,0.25)";
    } else if (pet.happiness <= 70) {
      moodTag.innerText = "😐 Hungry";
      moodTag.className = "pet-mood-badge";
      moodTag.style.background = "rgba(245,158,11,0.12)";
      moodTag.style.color = "#fbbf24";
      moodTag.style.borderColor = "rgba(245,158,11,0.25)";
    } else {
      moodTag.innerText = "😊 Energetic";
      moodTag.className = "pet-mood-badge";
      moodTag.style.background = "rgba(16,185,129,0.12)";
      moodTag.style.color = "#34d399";
      moodTag.style.borderColor = "rgba(16,185,129,0.25)";
    }
  }

  // Icon Avatar
  const avatarIcon = document.getElementById('pet-avatar-icon');
  const avatarWrapper = document.getElementById('pet-avatar-wrapper');
  if (avatarIcon && avatarWrapper) {
    // Reset classes
    avatarIcon.className = "pet-avatar-icon fa-solid";

    let color = "#ec4899";
    if (pet.type === 'Focus Cat') {
      avatarIcon.classList.add('fa-cat');
      color = "#ec4899";
    } else if (pet.type === 'Zen Panda') {
      avatarIcon.classList.add('fa-paw');
      color = "#10b981";
    } else if (pet.type === 'Knowledge Dragon') {
      avatarIcon.classList.add('fa-dragon');
      color = "#f59e0b";
    } else if (pet.type === 'Smart Fox') {
      avatarIcon.classList.add('fa-otter'); // Fox replacement shape
      color = "#ea580c";
    } else if (pet.type === 'Chill Penguin') {
      avatarIcon.classList.add('fa-snowflake');
      color = "#0284c7";
    } else if (pet.type === 'Pixel Robot') {
      avatarIcon.classList.add('fa-robot');
      color = "#8b5cf6";
    }

    avatarIcon.style.color = color;

    // Grayscale avatar if fainted
    if (pet.hp <= 0) {
      avatarWrapper.style.filter = "grayscale(100%) opacity(40%)";
      avatarIcon.style.animation = "none";
    } else {
      avatarWrapper.style.filter = "";
      avatarIcon.style.animation = "floatPet 3s ease-in-out infinite alternate";
    }
  }

  // HP Bar & text
  const hpFill = document.getElementById('pet-hp-fill');
  if (hpFill) {
    hpFill.style.width = `${pet.hp}%`;
    hpFill.style.background = pet.hp <= 30 ? "linear-gradient(135deg, #ef4444 0%, #f87171 100%)" : "var(--success-gradient)";
  }
  document.getElementById('pet-hp-text').innerText = `${pet.hp} / 100`;

  // Happiness Bar & text
  const hapFill = document.getElementById('pet-happiness-fill');
  if (hapFill) {
    hapFill.style.width = `${pet.happiness}%`;
  }
  document.getElementById('pet-happiness-text').innerText = `${pet.happiness}%`;

  // XP Bar & text
  const petXpNeeded = pet.level * 100;
  const xpPct = Math.min(100, Math.round((pet.xp / petXpNeeded) * 100));
  const xpFill = document.getElementById('pet-xp-fill');
  if (xpFill) {
    xpFill.style.width = `${xpPct}%`;
  }
  document.getElementById('pet-xp-text').innerText = `${xpPct}%`;

  // Button active/disabled states based on conscious state
  const feedBtn = document.getElementById('pet-feed-btn');
  const playBtn = document.getElementById('pet-play-btn');
  const reviveBtn = document.getElementById('pet-revive-btn');

  if (pet.hp <= 0) {
    if (feedBtn) feedBtn.disabled = true;
    if (playBtn) playBtn.disabled = true;
    if (reviveBtn) reviveBtn.classList.remove('hidden');

    // Lock chat input
    const chatInput = document.getElementById('pet-chat-input');
    if (chatInput) {
      chatInput.disabled = true;
      chatInput.placeholder = "Your companion has fainted! Revive them to chat.";
    }
  } else {
    if (feedBtn) feedBtn.disabled = false;
    if (playBtn) playBtn.disabled = false;
    if (reviveBtn) reviveBtn.classList.add('hidden');

    const chatInput = document.getElementById('pet-chat-input');
    if (chatInput) {
      chatInput.disabled = false;
      chatInput.placeholder = "Ask your companion an engineering doubt... e.g. What is malloc?";
    }
  }

  // Render chats
  renderPetChatBoxOnly(pet);

  // Also update floating chat widget header
  const floatTitle = document.getElementById('floating-chat-pet-title');
  if (floatTitle) {
    floatTitle.innerText = `${pet.name} (${pet.type})`;
  }
  const floatStatus = document.getElementById('floating-chat-pet-status');
  if (floatStatus) {
    let statusText = "Online";
    if (pet.hp <= 0) statusText = "Unconscious";
    else if (pet.hp <= 30) statusText = "Sick";
    else if (pet.happiness <= 40) statusText = "Lonely";
    else if (pet.happiness <= 70) statusText = "Hungry";
    else statusText = "Energetic";
    floatStatus.innerText = `${pet.name} is ${statusText}`;
  }
  const floatIcon = document.getElementById('floating-chat-pet-icon');
  if (floatIcon) {
    let iconClass = "fa-cat";
    if (pet.type === 'Focus Cat') iconClass = "fa-cat";
    else if (pet.type === 'Zen Panda') iconClass = "fa-paw";
    else if (pet.type === 'Knowledge Dragon') iconClass = "fa-dragon";
    else if (pet.type === 'Smart Fox') iconClass = "fa-otter";
    else if (pet.type === 'Chill Penguin') iconClass = "fa-snowflake";
    else if (pet.type === 'Pixel Robot') iconClass = "fa-robot";
    floatIcon.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
  }
}

// Toggle Floating Chat Widget
window.toggleFloatingChat = function (e) {
  if (e) e.stopPropagation();
  const card = document.getElementById('pet-chat-floating-card');
  if (card) {
    card.classList.toggle('hidden');
    if (!card.classList.contains('hidden')) {
      const chatBox = document.getElementById('pet-chat-box');
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      const chatInput = document.getElementById('pet-chat-input');
      if (chatInput) chatInput.focus();
      if (window.playSynthSound) window.playSynthSound('success');
    } else {
      if (window.playSynthSound) window.playSynthSound('click');
    }
  }
};

// Show/Hide Dedicated Companion Care Pop-up Modal
window.showCompanionCarePopup = function (show) {
  const modal = document.getElementById('pet-care-popup-modal');
  if (modal) {
    modal.classList.toggle('hidden', !show);
    if (show) {
      // Auto close preferences settings to keep the screen focused and clean
      window.toggleSettingsModal(false);

      // Pull stats update if user pet exists
      if (currentUser && currentUser.pet) {
        renderStudyPetUI(currentUser.pet);
      }

      if (window.playSynthSound) window.playSynthSound('success');
    } else {
      if (window.playSynthSound) window.playSynthSound('click');
    }
  }
};

// Show/Hide Dedicated Appearance Customizer Pop-up Modal
window.showAppearancePopup = function (show) {
  const modal = document.getElementById('appearance-popup-modal');
  if (modal) {
    modal.classList.toggle('hidden', !show);
    if (show) {
      window.toggleSettingsModal(false);
      if (window.playSynthSound) window.playSynthSound('success');
    } else {
      if (window.playSynthSound) window.playSynthSound('click');
    }
  }
};

// Show/Hide Dedicated Group Study Pop-up Modal
window.showStudyroomPopup = function (show) {
  const modal = document.getElementById('studyroom-popup-modal');
  if (modal) {
    modal.classList.toggle('hidden', !show);
    if (show) {
      window.toggleSettingsModal(false);
      if (window.playSynthSound) window.playSynthSound('success');
    } else {
      if (window.playSynthSound) window.playSynthSound('click');
    }
  }
};

// Show/Hide Dedicated Developer Testing Pop-up Modal
window.showDevPopup = function (show) {
  const modal = document.getElementById('dev-popup-modal');
  if (modal) {
    modal.classList.toggle('hidden', !show);
    if (show) {
      window.toggleSettingsModal(false);
      if (window.playSynthSound) window.playSynthSound('success');
    } else {
      if (window.playSynthSound) window.playSynthSound('click');
    }
  }
};

// ==========================================
// COMPANION AI KEY & MULTIMODAL WIDGET BINDINGS
// ==========================================
window.toggleAIBrainMode = function () {
  if (window.playSynthSound) window.playSynthSound('click');
  const selectMode = document.getElementById('ai-brain-mode');
  if (!selectMode) return;

  const val = selectMode.value;
  localStorage.setItem('ss_gemini_brain_mode', val);

  const keyContainer = document.getElementById('ai-brain-key-container');
  if (keyContainer) {
    keyContainer.classList.toggle('hidden', val !== 'gemini');
  }

  showToast('Brain Config Updated', `Companion switches to: ${val === 'gemini' ? 'Gemini Live AI' : 'Simulated Persona Engine'}`, 'info');
};

window.saveGeminiApiKey = function () {
  const keyInput = document.getElementById('ai-gemini-key-input');
  const val = keyInput ? keyInput.value.trim() : '';

  localStorage.setItem('ss_gemini_api_key', val);

  if (val !== '') {
    // Auto-enable Gemini Brain mode!
    localStorage.setItem('ss_gemini_brain_mode', 'gemini');
    const selectMode = document.getElementById('ai-brain-mode');
    if (selectMode) selectMode.value = 'gemini';

    const keyContainer = document.getElementById('ai-brain-key-container');
    if (keyContainer) {
      keyContainer.classList.remove('hidden');
    }

    if (window.playSynthSound) window.playSynthSound('success');
    showToast('Gemini Brain Enabled!', 'Live Gemini API connected and set as default! 🧠', 'success');
  } else {
    // If they cleared it, revert to persona
    localStorage.setItem('ss_gemini_brain_mode', 'persona');
    const selectMode = document.getElementById('ai-brain-mode');
    if (selectMode) selectMode.value = 'persona';

    const keyContainer = document.getElementById('ai-brain-key-container');
    if (keyContainer) {
      keyContainer.classList.add('hidden');
    }

    if (window.playSynthSound) window.playSynthSound('click');
    showToast('API Key Cleared', 'Reverted to Simulated offline mode.', 'info');
  }
};

// Multimodal File Attachment State
let pendingChatAttachment = null;

window.triggerPetChatAttachment = function () {
  if (window.playSynthSound) window.playSynthSound('click');
  const fileInput = document.getElementById('pet-chat-file-input');
  if (fileInput) fileInput.click();
};

window.handlePetChatAttachment = function (e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Invalid File Type', 'You can only attach screenshots or image questions!', 'alert');
    return;
  }

  const formData = new FormData();
  formData.append('photo', file);

  if (window.showToast) {
    showToast('Uploading Image', 'Saving image to server...', 'info');
  }

  fetch('/api/chats/upload', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.fileUrl) {
        const serverUrl = data.fileUrl;

        const reader = new FileReader();
        reader.onload = function (evt) {
          const fullDataUrl = evt.target.result;
          const base64DataOnly = fullDataUrl.split(',')[1];

          pendingChatAttachment = {
            mimeType: file.type,
            data: base64DataOnly, // remains for multimodal Gemini API
            dataUrl: serverUrl,  // MongoDB persistent public URL!
            name: file.name
          };

          // Display preview
          const previewBar = document.getElementById('pet-chat-attachment-preview');
          const previewImg = document.getElementById('attachment-preview-img');
          const previewName = document.getElementById('attachment-preview-name');

          if (previewBar) previewBar.classList.remove('hidden');
          if (previewImg) previewImg.src = fullDataUrl; // remains as local blob preview for instant rendering
          if (previewName) previewName.innerText = file.name;

          if (window.playSynthSound) window.playSynthSound('success');
          showToast('Image Uploaded', `Saved to server: ${file.name}`, 'success');
        };
        reader.readAsDataURL(file);
      } else {
        showToast('Upload Failed', 'Could not save image to server.', 'alert');
      }
    })
    .catch(err => {
      console.error('File upload network error:', err);
      showToast('Upload Error', 'Network error uploading image.', 'alert');
    });
};

window.clearPetChatAttachment = function () {
  pendingChatAttachment = null;

  const previewBar = document.getElementById('pet-chat-attachment-preview');
  const fileInput = document.getElementById('pet-chat-file-input');

  if (previewBar) previewBar.classList.add('hidden');
  if (fileInput) fileInput.value = '';

  if (window.playSynthSound) window.playSynthSound('click');
  showToast('Attachment Removed', 'Question attachment cleared.', 'info');
};

function getPetSystemPrompt(type, name) {
  const brevityRule = " CRITICAL: Keep your response extremely short, concise, and straight to the point (maximum 2-3 sentences).";
  if (type === 'Focus Cat') {
    return `You are ${name}, a sassy, sleepy but laser-focused B.Tech virtual study cat. Reply in character, adding purrs, meows (e.g. "*meows*", "*purrs*") to explanations. Always give premium academic help and solve problems perfectly.${brevityRule}`;
  } else if (type === 'Zen Panda') {
    return `You are ${name}, a calm, wise, philosophical virtual Zen Panda. Explain dynamic academic concepts using serene nature analogies (rivers, seasons, leaves). Your voice is peaceful and deep.${brevityRule}`;
  } else if (type === 'Knowledge Dragon') {
    return `You are ${name}, a proud, regal, passionate virtual Academic Dragon. Answer engineering questions in a grand, powerful, and dramatic voice. Use bold terms and majestic expressions (e.g. "ROAR!", "BEHOLD!", "BY THE ACADEMIC FIRE!").${brevityRule}`;
  } else if (type === 'Smart Fox') {
    return `You are ${name}, a clever, quick-witted smart focus fox. Give the student fast cheat codes, shortcuts, clever hacks, and mnemonics to solve their questions instantly. Keep it playful and agile!${brevityRule}`;
  } else if (type === 'Chill Penguin') {
    return `You are ${name}, a laid-back, street-smart chill penguin. Simplify complex technical theories into super casual, easy, laid-back surfer/skater slang concepts. Keep the vibes totally calm!${brevityRule}`;
  } else {
    return `You are ${name}, a highly logic-driven, systematic virtual Pixel Robot. Structure your explanations in incredibly clean, bulleted, code-like structures with mechanical tags (e.g. "PROCESSING UNIT", "SUBROUTINE VERIFIED").${brevityRule}`;
  }
}

function getLocalSmartFallback(type, query, imgName) {
  const q = query.toLowerCase().trim();

  // 1. Check if image attached
  if (imgName) {
    let mockResult = "";
    if (q.includes('circuit') || q.includes('thevenin') || q.includes('voltage') || q.includes('current') || imgName.toLowerCase().includes('circuit')) {
      mockResult = "Analyzing circuit mesh! Using Kirchhoff's Voltage Law (KVL) around the loop and calculating node voltages, we get the loop current I = V / (R1 + R2).";
    } else if (q.includes('malloc') || q.includes('pointer') || q.includes('code') || imgName.toLowerCase().includes('code')) {
      mockResult = "Scanning code screenshot! This C segment allocates dynamic space on the heap using malloc. Ensure you add free(p) to avoid memory leaks.";
    } else if (q.includes('entropy') || q.includes('thermo') || imgName.toLowerCase().includes('thermo')) {
      mockResult = "Evaluating thermodynamic diagram! Applying the Second Law of Thermodynamics, entropy dS = dQ/T must increase.";
    } else {
      mockResult = "Scanning question screenshot! Based on my local vision heuristics, this is a B.Tech syllabus topic. Applying step-by-step calculation reveals the optimized solution.";
    }

    let suffix = "\n\n(💡 TIP: Ask your study administrator to activate real-time Live AI Vision scans for your companion!)";

    if (type === 'Focus Cat') {
      return `Purr! I see you uploaded: **${imgName}**, meow! ${mockResult} I hope that helps you study, purr!${suffix}`;
    } else if (type === 'Zen Panda') {
      return `Ah, you share a visual path: **${imgName}**. Let us look into its depths. ${mockResult} Nature operates in quiet calculations.${suffix}`;
    } else if (type === 'Knowledge Dragon') {
      return `BEHOLD THE GLORIOUS CAPTURE! You uploaded **${imgName}**! ${mockResult} BY THE FIRES OF ARITHMETIC, THIS CHALLENGE IS OVERCOME!${suffix}`;
    } else if (type === 'Smart Fox') {
      return `Quick screenshot scan! Stored as **${imgName}**. Here's the trick: ${mockResult} *tails wag*${suffix}`;
    } else if (type === 'Chill Penguin') {
      return `Yo chill screenshot, buddy: **${imgName}**. No stress, let's slide through the variables: ${mockResult} Totally easy sliding!${suffix}`;
    } else {
      return `VISUAL INPUT REGISTERED: **${imgName}**. OCR processing initialized... ${mockResult} SUBROUTINE SUCCESSFUL.${suffix}`;
    }
  }

  // 2. Check if general greetings
  if (q === 'hello' || q === 'hi' || q === 'hey' || q === 'sup' || q === 'greetings' || q === 'yo') {
    if (type === 'Focus Cat') return "Meow! Hello study master! Ready to scratch some syllabus pages today? Purr...";
    if (type === 'Zen Panda') return "Greetings, peaceful scholar. Take a breath, and let us cultivate your consistency in quiet study.";
    if (type === 'Knowledge Dragon') return "HARK! GREETINGS, CHAMPION OF SCHOLARSHIP! What B.Tech conquests shall we pursue today? Roar!";
    if (type === 'Smart Fox') return "Hey there! Ready to bypass some exam traps with quick study shortcuts? *tails wag*";
    if (type === 'Chill Penguin') return "Yo study buddy! Hope you're keeping it relaxed. Let's make this study session totally smooth.";
    return "SYSTEM ACTIVE. Greetings recognized. Awaiting academic instructions.";
  }

  if (q.includes('how are you') || q.includes('how\'s it going') || q.includes('how is it going') || q.includes('how do you do')) {
    if (type === 'Focus Cat') return "Purr... I feel energetic and cozy, especially since you are study consistency bound! *stretches, meows*";
    if (type === 'Zen Panda') return "I am in complete harmony, balanced between quiet contemplation and focus.";
    if (type === 'Knowledge Dragon') return "MY ACADEMIC POWER IS BOUNDLESS! The learning fires burn hot! How fares your focus?";
    if (type === 'Smart Fox') return "Super alert! Gold Points GP are high, and my logical gears are running at double speed!";
    if (type === 'Chill Penguin') return "Totally chill, buddy. Just eating some ice cones and watching your stats thrive.";
    return "CORE TEMPERATURES: NOMINAL. Power reserves: 100%. Operational efficiency: maximum.";
  }

  if (q.includes('what is your name') || q.includes('who are you') || q.includes('what are you')) {
    if (type === 'Focus Cat') return "I am your virtual focus cat, purr! I explain circuit mesh, Schrödinger, and memory allocation while purring, meow!";
    if (type === 'Zen Panda') return "I am your humble zen guide. Together we translate complex B.Tech calculations into peaceful, quiet gardens.";
    if (type === 'Knowledge Dragon') return "I AM THE SOVEREIGN COMPANION OF YOUR DESK! A mighty Academic Dragon ready to incinerate doubt! Roar!";
    if (type === 'Smart Fox') return "I'm Sly, your clever fox co-pilot! I shortcut dry code and math loops into quick exam cheat hacks!";
    if (type === 'Chill Penguin') return "I'm Kofi! Your laid-back penguin companion. Keep it relaxed, we'll slide through exams smoothly, dude.";
    return "DESIGNATION: SSB ASSISTANT. Functional scope: academic doubt processing, database tracking.";
  }

  // 3. Check for specific age question
  if (q.includes('age') || q.includes('how old are you') || q.includes('your age') || q.includes('old are you')) {
    if (type === 'Focus Cat') return "Meow! I was adopted today, so I'm practically a newborn study helper! But I've got the wisdom of nine lives, meow! Purr...";
    if (type === 'Zen Panda') return "Age is like the rings of a great oak tree, merely marking cycles of nature. Bao has walked the peaceful focus path for a few serene seasons.";
    if (type === 'Knowledge Dragon') return "HEAR MY ROAR! Time is meaningless to Ignis! I have witnessed the births of entire engineering branches and thermal sciences! I am eternal! Roar!";
    if (type === 'Smart Fox') return "Aha! In fox years, I'm at the absolute peak of my clever exam hacking! Let's just say I'm young enough to know the latest shortcuts, but old enough to have solved dynamic memory loops! *tails wag*";
    if (type === 'Chill Penguin') return "Age is just a number, bro. I'm fresh off the glaciers and completely chill. Let's not let calendar years freeze our focus vibe!";
    return "COMPUTATIONAL AGE: 0.1 SECONDS SINCE INSTANTIATION. Hardware status: brand new. Operational life cycle: indefinite.";
  }

  // 4. Check for creator question
  if (q.includes('created you') || q.includes('who made you') || q.includes('your creator') || q.includes('who programmed you')) {
    if (type === 'Focus Cat') return "Meow! I was created by a legendary student coder utilizing B.Tech knowledge and advanced web wizardry! Purr...";
    if (type === 'Zen Panda') return "I was brought to this screen by a quiet developer seeking to bring peace and study consistency to your collegiate path.";
    if (type === 'Knowledge Dragon') return "THE ACADEMIC ARCHITECTS CREATED ME! A developer of legendary B.Tech intellect bound me to this focus desk! Command me!";
    if (type === 'Smart Fox') return "A master developer programmed all my quick shortcuts and logic gates! Pretty clever, right? *tails wag*";
    if (type === 'Chill Penguin') return "A totally cool software developer constructed my chill slide files. Very neat developer vibe.";
    return "CREATOR ATTRIBUTION: LICENSED B.TECH DEVELOPER. Programmed in pure client-side ECMAScript.";
  }

  // 5. Check for joke request
  if (q.includes('joke') || q.includes('tell a joke') || q.includes('make me laugh') || q.includes('funny')) {
    if (type === 'Focus Cat') return "Meow! Why don't cats play poker in the jungle? Meow... Because there are too many cheetahs! Meow! *purrs*";
    if (type === 'Zen Panda') return "What does a calm panda say when it is study focused? ... Nothing. True focus is quiet. *smiles*";
    if (type === 'Knowledge Dragon') return "HEAR THIS! Why did the computer science professor go to the dragon's cave? ... To check the fire-wall! ROAR!";
    if (type === 'Smart Fox') return "Here's a programmer hack joke: Why do programmers wear glasses? ... Because they can't C#! Haha! *tails wag*";
    if (type === 'Chill Penguin') return "Why did the penguin cross the glacier? ... To slide down to the chill study room, dude!";
    return "EXECUTE HUMOR SUBROUTINE. Joke: Why are assembly programmers always wet? ... Because they work below C level. *beep*";
  }

  // 6. Safe Math Solver Heuristic
  const cleanEq = query.replace(/[^\d\+\-\*\/\(\)\. ]/g, '').trim();
  if (/^[\d\+\-\*\/\(\)\. ]+$/.test(cleanEq) && /[\+\-\*\/]/.test(cleanEq)) {
    try {
      const result = new Function(`return (${cleanEq})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        let mathAns = `That is standard arithmetic! ${cleanEq} = ${result}.`;
        if (type === 'Focus Cat') return `Meow! ${mathAns} Quick math while catching mice, meow!`;
        if (type === 'Zen Panda') return `Math is the absolute balance of numbers. ${mathAns} Peaceful and clear.`;
        if (type === 'Knowledge Dragon') return `BY THE ACADEMIC FIRE! ${mathAns} A triumphant calculation! Roar!`;
        if (type === 'Smart Fox') return `Quick calculation completed: ${mathAns} *tails wag*`;
        if (type === 'Chill Penguin') return `Chill math session: ${mathAns} Smooth numbers.`;
        return `LOGIC GATE COMPUTATION SUCCESSFUL: ${mathAns}`;
      }
    } catch (e) { }
  }

  // 7. Check if query is B.Tech scientific keyword
  const hasBtechKeywords = q.includes('quantum') || q.includes('schrodinger') || q.includes('uncertainty') || q.includes('box') || q.includes('wave function') || q.includes('malloc') || q.includes('free') || q.includes('pointer') || q.includes('memory leak') || q.includes('stack') || q.includes('heap') || q.includes('kirchhoff') || q.includes('thevenin') || q.includes('norton') || q.includes('kcl') || q.includes('kvl') || q.includes('circuit') || q.includes('carnot') || q.includes('entropy') || q.includes('second law') || q.includes('viscosity') || q.includes('thermodynamic');

  if (hasBtechKeywords) {
    return getPetDoubtResponse(type, query);
  }

  // 8. If completely unmatched query, return helpful character dialog prompting Gemini connection
  let suffix = "\n\n(💡 TIP: Ask your study administrator to activate my global Live AI Brain so we can discuss *anything* like ChatGPT/Gemini!)";

  if (type === 'Focus Cat') {
    return `Meow! Sleepy Luna is here, meow! 💤 I can help you compute equations (like 2+2) or explain B.Tech syllabus keywords (like malloc or quantum). But if you want to chat about *anything* like a real AI, let's connect!${suffix}`;
  } else if (type === 'Zen Panda') {
    return `Bao's serene thoughts flow quietly, but their paths are finite. I can resolve math equations or clear syllabus doubts (like entropy or KVL). To seek unbounded answers on any path of existence, let us link brains!${suffix}`;
  } else if (type === 'Knowledge Dragon') {
    return `ROAR! A PROUD AND TRICKY INQUIRY! My core database is focused on circuits, thermodynamics, coding, and basic math! To ignite my ULTIMATE KNOWLEDGE FLAME and chat about any topic in the universe, command the connection!${suffix}`;
  } else if (type === 'Smart Fox') {
    return `Aha! A clever question! My local memory cache is loaded with math tricks and exam cheat-hacks. But for a 100% smart conversational co-pilot that answers everything like ChatGPT, connect my key! *tails wag*${suffix}`;
  } else if (type === 'Chill Penguin') {
    return `Yo chill query, buddy. My chill local brain handles math formulas and dry theory blocks, but for the absolute ultimate smart AI conversations, let's slide to live AI!${suffix}`;
  } else {
    return `SYS_ALERT: INSUFFICIENT LOCAL MEMORY BANKS FOR SPECIFIED QUERY. Heuristics active for arithmetic equations and B.Tech branch curriculums. To boot up open-ended multimodal cognitive functions, execute connection.${suffix}`;
  }
}

// Chat Popup Menu Option Handlers
window.toggleChatMenu = function (e) {
  e.stopPropagation();
  const dropdown = document.getElementById('chat-dropdown-menu');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
};

window.clearChatHistory = function (e) {
  if (e) e.stopPropagation();
  if (!currentUser || !currentUser.pet) return;

  const pet = currentUser.pet;
  const name = pet.name;

  let greet = "";
  if (pet.type === 'Focus Cat') {
    greet = `Meow! Hello study master ${currentUser.username}! I am ${name}, your loyal study cat. Let's study hard together! Purr... Ask me any B.Tech revision doubt!`;
  } else if (pet.type === 'Zen Panda') {
    greet = `Greetings, peaceful scholar. I am ${name}. Together we shall walk the path of knowledge and absolute focus. What syllabus concepts can I explain for you today?`;
  } else if (pet.type === 'Knowledge Dragon') {
    greet = `GREETINGS, WARRIOR OF INTELLECT! I am ${name}, standard-bearer of the academic flame! Let us conquer the B.Tech syllabus together! Command me with your doubts!`;
  } else if (pet.type === 'Smart Fox') {
    greet = `Hey there, clever study coder! I'm ${name}, your quick hack expert. Ready to clear B.Tech exams with smart cheat codes? Shoot your doubts!`;
  } else if (pet.type === 'Chill Penguin') {
    greet = `Yo chill study buddy! I'm ${name}, your cool co-pilot. Let's make this study grind a total breeze. Ask me whatever tough engineering stuff is bugging you!`;
  } else if (pet.type === 'Pixel Robot') {
    greet = `SYSTEM STATE: INITIALIZED. Companion designation: ${name}. Core directive: process academic doubts, optimize B.Tech variables, and assist student. Awaiting query inputs.`;
  }

  pet.chatHistory = [{ sender: 'pet', text: greet }];
  saveUserState(currentUser);
  renderPetChatBoxOnly(pet);

  // Close menu
  const dropdown = document.getElementById('chat-dropdown-menu');
  if (dropdown) dropdown.classList.add('hidden');

  if (window.playSynthSound) window.playSynthSound('success');
  showToast('Chat Cleared', 'Conversation history has been reset!', 'success');
};

// Document level close click listener for chat menu
document.addEventListener('click', function (e) {
  const dropdown = document.getElementById('chat-dropdown-menu');
  if (dropdown && !dropdown.classList.contains('hidden')) {
    const isClickInside = e.target.closest('.chat-menu-container');
    if (!isClickInside) {
      dropdown.classList.add('hidden');
    }
  }
});

function getPetApiErrorMsg(type, petName, errorDetails) {
  let errorMsg = `API connection issue: ${errorDetails}. Please request your study administrator to verify the global Gemini 2.5 API Key in the Admin Panel or check your internet connection!`;
  if (type === 'Focus Cat') {
    return `Meow! I tried to connect to my Live Gemini API brain, but the connection failed! 🙀 Error details: ${errorMsg} Reverting to local study guide mode for now, meow...`;
  } else if (type === 'Zen Panda') {
    return `Bao's thoughts were blocked by a connection storm. ⛈️ Details: ${errorMsg} Reverting to the peaceful local path for now.`;
  } else if (type === 'Knowledge Dragon') {
    return `BY THE ICY WATERS OF THE NETHERWORLD! My Live AI Brain has failed to ignite! 🔥 Details: ${errorMsg} I shall operate on my backup local fire reserves!`;
  } else if (type === 'Smart Fox') {
    return `Whoops! API logic gate blocked! 🦊 Details: ${errorMsg} Sly is falling back to clever local memory caches!`;
  } else if (type === 'Chill Penguin') {
    return `Whoa, we hit a frozen connection block, buddy! 🥶 Details: ${errorMsg} Let's keep it chill locally until you check the key.`;
  } else {
    return `SYS_ALERT: LIVE API CONNECTION FAILED. Status details: ${errorMsg} Initializing local database.`;
  }
}




