# RouteX - Intelligent Fleet Optimization Platform

*(Formerly SmartRoute)*

RouteX is an advanced, production-ready, DSA-intensive intelligent fleet optimization platform. It goes beyond basic pathfinding to offer multi-vehicle routing (VRP), dynamic rerouting, what-if scenario simulations, and explainable ML ETA predictions.

## New Features
- **Algorithm Engine**: Modular support for Dijkstra, A*, and TSP (Nearest Neighbor + 2-opt swaps).
- **VRP Engine**: Greedy capability-based assignment handling weight and priority constraints across multiple vehicle types.
- **Explainable ETA**: ML ETA prediction with breakdown analysis showing feature impact (traffic, weather, stops).
- **What-If Simulator**: Sandbox environment to test the routing algorithms under stress conditions (Heavy Traffic, Rain).
- **Algorithm Comparison Lab**: Direct benchmark of Dijkstra vs A* node exploration count and execution time.
- **Logistics Command Center**: Modern React dashboard with live KPIs, success rates, and cost analysis.

## Architecture
The system is built on:
- **FastAPI**: Modular routing structure (`api/routers/`) separating concerns (orders, vehicles, routes, predictions, simulation).
- **React**: Modern Vite + Tailwind frontend.
- **SQLAlchemy / Postgres**: Extended data models tracking vehicle constraints, execution history, and optimization scores.
- **OSMnx / NetworkX**: For geographical road networks and real-world distance calculations.

## Running the Application
1. Ensure Docker and Docker Compose are installed.
2. Run `docker-compose up --build`
3. Access the frontend at `http://localhost:3005`
4. Access the API at `http://localhost:8000/docs`

## Demo Walkthrough
- Go to **What-If Simulator** on the frontend to run simulated loads and compare VRP vs TSP.
- Go to **Algorithm Lab** to see the performance differences between Dijkstra and A* pathfinding.
